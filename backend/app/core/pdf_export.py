import re
from io import BytesIO
from typing import Any, Dict, List, Tuple

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


INK = HexColor("#111111")
GRAY = HexColor("#333333")
MUTED = HexColor("#555555")

HTML_TAG_RE = re.compile(r"<[^>]+>")
BAD_GLYPHS = {
    "■": " ",
    "□": " ",
    "▪": " ",
    "▫": " ",
    "●": " ",
    "○": " ",
    "◆": " ",
    "▪︎": " ",
    "•": " ",
    "‣": " ",
    "∙": " ",
    "\u25a0": " ",
    "\u25aa": " ",
    "\ufffd": " ",
}


def build_tailored_resume_pdf(payload: Dict[str, Any]) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=0.65 * inch,
        rightMargin=0.65 * inch,
        topMargin=0.5 * inch,
        bottomMargin=0.5 * inch,
        title="Resume",
    )

    styles = getSampleStyleSheet()
    name_style = ParagraphStyle(
        "Name",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=18,
        textColor=INK,
        alignment=TA_CENTER,
        spaceAfter=4,
        leading=22,
    )
    contact_style = ParagraphStyle(
        "Contact",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        textColor=GRAY,
        alignment=TA_CENTER,
        spaceAfter=10,
        leading=13,
    )
    section_style = ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11.5,
        textColor=INK,
        spaceBefore=11,
        spaceAfter=5,
        leading=14,
        alignment=TA_LEFT,
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        textColor=INK,
        leading=13.2,
        spaceAfter=3,
        alignment=TA_LEFT,
    )
    category_style = ParagraphStyle(
        "Category",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        textColor=INK,
        leading=13,
        alignment=TA_LEFT,
    )
    skills_style = ParagraphStyle(
        "SkillsLine",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        textColor=INK,
        leading=13,
        alignment=TA_LEFT,
    )
    project_title_style = ParagraphStyle(
        "ProjectTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        textColor=INK,
        leading=13.5,
        spaceBefore=5,
        spaceAfter=1,
    )
    edu_title_style = ParagraphStyle(
        "EduTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        textColor=INK,
        leading=13,
        spaceBefore=3,
        spaceAfter=1,
    )
    meta_style = ParagraphStyle(
        "Meta",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        textColor=MUTED,
        leading=12,
        spaceAfter=2,
    )
    bullet_style = ParagraphStyle(
        "Bullet",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        textColor=INK,
        leading=13,
        leftIndent=14,
        bulletIndent=0,
        spaceAfter=1,
    )

    contact = payload.get("contact_info") or {}
    name = _plain(contact.get("name") or "Candidate")
    contact_bits = [
        _plain(contact.get("email")),
        _plain(contact.get("phone")),
        _plain(contact.get("location") or contact.get("address")),
        _plain(contact.get("github")),
        _plain(contact.get("linkedin")),
    ]
    contact_line = "  |  ".join([bit for bit in contact_bits if bit])

    story = []
    story.append(Paragraph(_xml_escape(name), name_style))
    if contact_line:
        story.append(Paragraph(_xml_escape(contact_line), contact_style))

    summary = _plain(payload.get("professional_summary") or "")
    if summary:
        story.append(Paragraph("OBJECTIVE", section_style))
        story.append(Paragraph(_xml_escape(summary), body_style))

    skill_rows = _normalized_skill_rows(payload)
    if skill_rows:
        story.append(Paragraph("SKILLS", section_style))
        for category, items in skill_rows:
            table = Table(
                [[
                    Paragraph(_xml_escape(f"{category}:"), category_style),
                    Paragraph(_xml_escape(", ".join(items)), skills_style),
                ]],
                colWidths=[1.85 * inch, 5.35 * inch],
            )
            table.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 1),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]))
            story.append(table)

    projects = payload.get("projects") or []
    if projects:
        story.append(Paragraph("ACADEMIC PROJECTS", section_style))
        for project in projects:
            title, tech = _project_title_and_tech(project)
            if tech:
                story.append(Paragraph(_xml_escape(f"{title}, {tech}"), project_title_style))
            else:
                story.append(Paragraph(_xml_escape(title), project_title_style))
            bullets = project.get("bullets") or []
            if not bullets and project.get("description"):
                bullets = _split_bullets(project.get("description"))
            for bullet in bullets:
                cleaned = _plain(bullet).lstrip("- ").strip()
                if cleaned:
                    story.append(Paragraph(f"- {_xml_escape(cleaned)}", bullet_style))

    education = payload.get("education") or []
    if education:
        story.append(Paragraph("EDUCATION", section_style))
        for item in education:
            degree = _plain(item.get("degree") or "Degree")
            institution = _plain(item.get("institution") or "")
            header = degree if not institution else f"{degree}, {institution}"
            story.append(Paragraph(_xml_escape(header), edu_title_style))
            details = _plain(item.get("details") or "")
            dates = _plain(item.get("dates") or item.get("date") or "")
            cgpa = _plain(item.get("cgpa") or item.get("gpa") or "")
            meta_parts = [part for part in [dates, details, cgpa] if part]
            if meta_parts:
                story.append(Paragraph(_xml_escape("  |  ".join(meta_parts)), meta_style))

    achievements = payload.get("achievements") or payload.get("volunteer_work") or []
    certifications = payload.get("certifications") or []
    award_lines = []
    for item in achievements:
        if isinstance(item, dict):
            line = item.get("activity") or item.get("title") or item.get("name") or ""
        else:
            line = str(item)
        line = _plain(line)
        if line:
            award_lines.append(line)
    for cert in certifications:
        line = _plain(cert)
        if line:
            award_lines.append(line)

    if award_lines:
        story.append(Paragraph("ACHIEVEMENTS / CERTIFICATIONS", section_style))
        for line in award_lines:
            story.append(Paragraph(f"- {_xml_escape(line)}", bullet_style))

    story.append(Spacer(1, 6))
    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes


def _plain(value: Any) -> str:
    text = str(value or "")
    text = HTML_TAG_RE.sub("", text)
    for src, dest in BAD_GLYPHS.items():
        text = text.replace(src, dest)
    text = text.replace("&nbsp;", " ").replace("&amp;", "&")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _xml_escape(text: str) -> str:
    return (
        _plain(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def _split_bullets(text: str) -> List[str]:
    cleaned = _plain(text).replace(" - ", "\n")
    raw = re.split(r"[\n\r]+", cleaned)
    return [line.strip(" -") for line in raw if line.strip()]


def _normalized_skill_rows(payload: Dict[str, Any]) -> List[Tuple[str, List[str]]]:
    preferred = [
        "Programming Languages",
        "Frameworks/Tools",
        "Soft Skills",
    ]
    groups = payload.get("skill_groups") or []
    bucket: Dict[str, List[str]] = {name: [] for name in preferred}
    extras: List[Tuple[str, List[str]]] = []

    if groups:
        for group in groups:
            category = _plain(group.get("category") or "Skills")
            skills = [_plain(s) for s in (group.get("skills") or []) if _plain(s)]
            if not skills:
                continue
            mapped = _map_skill_category(category)
            if mapped in bucket:
                for skill in skills:
                    if skill not in bucket[mapped]:
                        bucket[mapped].append(skill)
            else:
                extras.append((category, skills))
    else:
        for skill in payload.get("prioritized_skills") or []:
            cleaned = _plain(skill)
            if cleaned:
                bucket["Frameworks/Tools"].append(cleaned)

    rows = [(name, bucket[name]) for name in preferred if bucket[name]]
    rows.extend(extras)
    return rows


def _map_skill_category(category: str) -> str:
    key = category.lower()
    if any(token in key for token in ["language", "programming"]):
        return "Programming Languages"
    if any(token in key for token in ["soft", "communication", "interpersonal"]):
        return "Soft Skills"
    if any(token in key for token in ["framework", "tool", "platform", "librar", "tech"]):
        return "Frameworks/Tools"
    return category


def _project_title_and_tech(project: Dict[str, Any]) -> Tuple[str, str]:
    title = _plain(project.get("title") or "Project")
    tech = _plain(project.get("tech_stack") or project.get("technologies") or "")
    if not tech and "," in title:
        parts = [p.strip() for p in title.split(",") if p.strip()]
        if len(parts) >= 2:
            title = parts[0]
            tech = ", ".join(parts[1:])
    return title, tech
