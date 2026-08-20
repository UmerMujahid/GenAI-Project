"""ReportLab PDF export helpers for tailored resumes and cover letters.

Normalizes Unicode punctuation for Helvetica/WinAnsi safety, mirrors original
resume section order when detectable, and builds in-memory PDF byte streams.
"""

import re
import unicodedata
from io import BytesIO
from typing import Any, Dict, List, Optional, Tuple

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


INK = HexColor("#111111")
GRAY = HexColor("#333333")
MUTED = HexColor("#555555")

HTML_TAG_RE = re.compile(r"<[^>]+>")

# Characters that Helvetica/WinAnsi cannot render (become ■ / garbage)
DASH_TRANSLATION = str.maketrans({
    "\u2010": "-",  # hyphen
    "\u2011": "-",  # non-breaking hyphen
    "\u2012": "-",  # figure dash
    "\u2013": "-",  # en dash
    "\u2014": "-",  # em dash
    "\u2015": "-",  # horizontal bar
    "\u2212": "-",  # minus sign
    "\u00ad": "-",  # soft hyphen
    "\ufe58": "-",  # small em dash
    "\ufe63": "-",  # small hyphen-minus
    "\uff0d": "-",  # fullwidth hyphen-minus
})

BAD_GLYPH_TRANSLATION = str.maketrans({
    "■": " ",
    "□": " ",
    "▪": " ",
    "▫": " ",
    "●": " ",
    "○": " ",
    "◆": " ",
    "‣": " ",
    "∙": " ",
    "\u25a0": " ",
    "\u25aa": " ",
    "\ufffd": " ",
})

# Known section keys -> heading labels and detection patterns in raw text
SECTION_META = {
    "objective": {
        "title": "OBJECTIVE",
        "aliases": ["objective", "professional summary", "career objective", "summary", "profile"],
    },
    "education": {
        "title": "EDUCATION",
        "aliases": ["education", "academic background"],
    },
    "skills": {
        "title": "SKILLS",
        "aliases": ["skills", "technical skills", "core competencies"],
    },
    "projects": {
        "title": "ACADEMIC PROJECTS",
        "aliases": ["academic projects", "projects", "personal projects", "key projects"],
    },
    "experience": {
        "title": "EXPERIENCE",
        "aliases": ["experience", "work experience", "professional experience", "internships"],
    },
    "achievements": {
        "title": "ACHIEVEMENTS",
        "aliases": ["achievements", "awards", "honors", "accomplishments"],
    },
    "languages": {
        "title": "LANGUAGES",
        "aliases": ["languages", "language proficiency"],
    },
    "certifications": {
        "title": "CERTIFICATIONS",
        "aliases": ["certifications", "certificates", "licenses"],
    },
}

# Benchmark order from Resume_UmerKaramat_2026.pdf
DEFAULT_SECTION_ORDER = [
    "objective",
    "education",
    "skills",
    "projects",
    "achievements",
    "languages",
    "certifications",
    "experience",
]


def detect_section_order(raw_text: str = "", explicit_order: Optional[List[str]] = None) -> List[str]:
    """Detect resume section sequence from explicit order or raw heading lines.

    Args:
        raw_text: Original resume text used to locate standalone section headings.
        explicit_order: Optional caller-provided section keys to honor first.

    Returns:
        list[str]: Ordered section keys (e.g. ``objective``, ``education``, ``skills``).
    """
    if explicit_order:
        cleaned = []
        seen = set()
        for key in explicit_order:
            k = str(key or "").strip().lower()
            if k in SECTION_META and k not in seen:
                cleaned.append(k)
                seen.add(k)
        if cleaned:
            for fallback in DEFAULT_SECTION_ORDER:
                if fallback not in seen:
                    cleaned.append(fallback)
            return cleaned

    text = raw_text or ""
    if not text.strip():
        return list(DEFAULT_SECTION_ORDER)

    # Only treat short standalone lines as section headings (avoid body-text false positives)
    found: List[Tuple[int, str]] = []
    lines = text.splitlines()
    offset = 0
    for line in lines:
        stripped = line.strip()
        line_start = offset
        offset += len(line) + 1
        if not stripped or len(stripped) > 48:
            continue
        # Heading lines are usually Title Case / UPPERCASE words without emails or bullets
        if "@" in stripped or stripped.startswith(("http", "•", "-", "*")):
            continue
        normalized = re.sub(r"[:\-–—]+\s*$", "", stripped).strip().lower()
        for key, meta in SECTION_META.items():
            if normalized in meta["aliases"]:
                found.append((line_start, key))
                break

    if not found:
        return list(DEFAULT_SECTION_ORDER)

    # Keep first occurrence of each section in document order
    seen = set()
    ordered: List[str] = []
    for _, key in sorted(found, key=lambda item: item[0]):
        if key not in seen:
            ordered.append(key)
            seen.add(key)

    for fallback in DEFAULT_SECTION_ORDER:
        if fallback not in ordered:
            ordered.append(fallback)
    return ordered


def build_tailored_resume_pdf(payload: Dict[str, Any]) -> bytes:
    """Build a single-column tailored resume PDF from structured payload data.

    Args:
        payload: Dict containing contact info, summary, skills, projects, education,
            optional ``section_order``, and related resume fields.

    Returns:
        bytes: Complete PDF document contents.
    """
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

    styles = _build_styles()
    story: List[Any] = []

    # ── Header ──────────────────────────────────────────────
    contact = payload.get("contact_info") or {}
    name = _plain(contact.get("name") or "Candidate")
    subtitle = _plain(
        payload.get("subtitle")
        or contact.get("title")
        or contact.get("headline")
        or contact.get("role")
        or ""
    )
    contact_bits = [
        _plain(contact.get("email")),
        _plain(contact.get("phone")),
        _plain(contact.get("location") or contact.get("address")),
        _plain(contact.get("github")),
        _plain(contact.get("linkedin")),
    ]
    contact_line = "  |  ".join([bit for bit in contact_bits if bit])

    story.append(Paragraph(_xml_escape(name), styles["name"]))
    if subtitle:
        story.append(Paragraph(_xml_escape(subtitle), styles["subtitle"]))
    if contact_line:
        story.append(Paragraph(_xml_escape(contact_line), styles["contact"]))

    # ── Dynamic sections in original order ──────────────────
    section_order = detect_section_order(
        raw_text=payload.get("raw_text") or "",
        explicit_order=payload.get("section_order"),
    )

    rendered = set()
    for section_key in section_order:
        if section_key in rendered:
            continue
        blocks = _render_section(section_key, payload, styles)
        if blocks:
            story.extend(blocks)
            rendered.add(section_key)

    story.append(Spacer(1, 6))
    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes


def _build_styles() -> Dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "Name",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=19,
            textColor=INK,
            alignment=TA_CENTER,
            spaceAfter=2,
            leading=23,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=11,
            textColor=GRAY,
            alignment=TA_CENTER,
            spaceAfter=4,
            leading=14,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            textColor=GRAY,
            alignment=TA_CENTER,
            spaceAfter=12,
            leading=13,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11.5,
            textColor=INK,
            spaceBefore=12,
            spaceAfter=6,
            leading=14,
            alignment=TA_LEFT,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            textColor=INK,
            leading=13.5,
            spaceAfter=3,
            alignment=TA_LEFT,
        ),
        "category": ParagraphStyle(
            "Category",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10,
            textColor=INK,
            leading=13,
            alignment=TA_LEFT,
        ),
        "skills": ParagraphStyle(
            "SkillsLine",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            textColor=INK,
            leading=13,
            alignment=TA_LEFT,
        ),
        "project_title": ParagraphStyle(
            "ProjectTitle",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            textColor=INK,
            leading=13.5,
            spaceBefore=5,
            spaceAfter=1,
        ),
        "edu_title": ParagraphStyle(
            "EduTitle",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            textColor=INK,
            leading=13,
            spaceBefore=3,
            spaceAfter=1,
        ),
        "meta": ParagraphStyle(
            "Meta",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            textColor=MUTED,
            leading=12,
            spaceAfter=2,
        ),
        # Hanging indent: first line has bullet, wrap aligns under text not under glyph
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            textColor=INK,
            leading=13.2,
            leftIndent=14,
            firstLineIndent=-10,
            spaceAfter=1.5,
        ),
        "lang_row": ParagraphStyle(
            "LangRow",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            textColor=INK,
            leading=13,
            spaceAfter=1,
        ),
    }


def _render_section(section_key: str, payload: Dict[str, Any], styles: Dict[str, ParagraphStyle]) -> List[Any]:
    title = SECTION_META[section_key]["title"]
    blocks: List[Any] = []

    if section_key == "objective":
        summary = _plain(payload.get("professional_summary") or payload.get("summary") or "")
        if not summary:
            return []
        blocks.append(Paragraph(title, styles["section"]))
        blocks.append(Paragraph(_xml_escape(summary), styles["body"]))
        return blocks

    if section_key == "education":
        education = payload.get("education") or []
        if not education:
            return []
        blocks.append(Paragraph(title, styles["section"]))
        for item in education:
            degree = _plain(item.get("degree") or "Degree")
            institution = _plain(item.get("institution") or "")
            header = degree if not institution else f"{degree}, {institution}"
            blocks.append(Paragraph(_xml_escape(header), styles["edu_title"]))
            details = _plain(item.get("details") or "")
            dates = _plain(item.get("dates") or item.get("date") or "")
            location = _plain(item.get("location") or "")
            cgpa = _plain(item.get("cgpa") or item.get("gpa") or "")
            # Prefer bullet for CGPA/grade lines matching original resume
            meta_parts = [part for part in [dates, location] if part]
            if meta_parts:
                blocks.append(Paragraph(_xml_escape("  |  ".join(meta_parts)), styles["meta"]))
            grade_line = cgpa or (details if re.search(r"(cgpa|gpa|%)", details, re.I) else "")
            other_details = "" if grade_line == details else details
            if grade_line:
                blocks.append(_bullet_paragraph(grade_line, styles["bullet"]))
            if other_details and other_details != grade_line:
                blocks.append(Paragraph(_xml_escape(other_details), styles["meta"]))
        return blocks

    if section_key == "skills":
        skill_rows = _normalized_skill_rows(payload)
        if not skill_rows:
            return []
        blocks.append(Paragraph(title, styles["section"]))
        for category, items in skill_rows:
            # Match original: category heading + bullet list of skills
            blocks.append(Paragraph(_xml_escape(category), styles["category"]))
            for skill in items:
                blocks.append(_bullet_paragraph(skill, styles["bullet"]))
        return blocks

    if section_key == "projects":
        projects = payload.get("projects") or []
        if not projects:
            return []
        blocks.append(Paragraph(title, styles["section"]))
        for project in projects:
            title_text, tech = _project_title_and_tech(project)
            if tech:
                blocks.append(
                    Paragraph(_xml_escape(f"{title_text}, {tech}"), styles["project_title"])
                )
            else:
                blocks.append(Paragraph(_xml_escape(title_text), styles["project_title"]))
            bullets = project.get("bullets") or []
            if not bullets and project.get("description"):
                bullets = _split_bullets(project.get("description"))
            for bullet in bullets:
                cleaned = _plain(bullet).lstrip("-• ").strip()
                if cleaned:
                    blocks.append(_bullet_paragraph(cleaned, styles["bullet"]))
        return blocks

    if section_key == "experience":
        experience = payload.get("experience") or []
        if not experience:
            return []
        blocks.append(Paragraph(title, styles["section"]))
        for item in experience:
            role = _plain(item.get("title") or "Role")
            company = _plain(item.get("company") or "")
            header = role if not company else f"{role}, {company}"
            blocks.append(Paragraph(_xml_escape(header), styles["project_title"]))
            dates = _plain(item.get("dates") or item.get("date") or "")
            if dates:
                blocks.append(Paragraph(_xml_escape(dates), styles["meta"]))
            desc = item.get("description") or ""
            for bullet in _split_bullets(desc) if desc else []:
                cleaned = _plain(bullet).lstrip("-• ").strip()
                if cleaned:
                    blocks.append(_bullet_paragraph(cleaned, styles["bullet"]))
        return blocks

    if section_key == "achievements":
        lines = _collect_achievement_lines(payload)
        if not lines:
            return []
        blocks.append(Paragraph(title, styles["section"]))
        for line in lines:
            blocks.append(_bullet_paragraph(line, styles["bullet"]))
        return blocks

    if section_key == "languages":
        languages = payload.get("languages") or []
        if not languages:
            return []
        blocks.append(Paragraph(title, styles["section"]))
        for item in languages:
            if isinstance(item, dict):
                lang = _plain(item.get("language") or item.get("name") or "")
                level = _plain(item.get("proficiency") or item.get("level") or "")
                line = lang if not level else f"{lang}  —  {level}"
            else:
                line = _plain(item)
            if line:
                blocks.append(Paragraph(_xml_escape(line), styles["lang_row"]))
        return blocks

    if section_key == "certifications":
        certifications = payload.get("certifications") or []
        if not certifications:
            return []
        blocks.append(Paragraph(title, styles["section"]))
        for cert in certifications:
            if isinstance(cert, dict):
                name = _plain(cert.get("name") or cert.get("title") or "")
                issuer = _plain(cert.get("issuer") or "")
                category = _plain(cert.get("category") or "")
                if name:
                    blocks.append(Paragraph(_xml_escape(name), styles["project_title"]))
                if category:
                    blocks.append(_bullet_paragraph(f"Category: {category}", styles["bullet"]))
                if issuer:
                    blocks.append(_bullet_paragraph(f"Issuer: {issuer}", styles["bullet"]))
            else:
                line = _plain(cert)
                if line:
                    blocks.append(_bullet_paragraph(line, styles["bullet"]))
        return blocks

    return []


def _bullet_paragraph(text: str, style: ParagraphStyle) -> Paragraph:
    """Use ReportLab &bull; entity so Helvetica/ZapfDingbats renders a real round bullet."""
    cleaned = _plain(text).lstrip("-• ").strip()
    return Paragraph(f"&bull; {_xml_escape(cleaned)}", style)


def _plain(value: Any) -> str:
    """Normalize to Helvetica-safe UTF-8 / ASCII hyphen text (no black-box glyphs)."""
    text = str(value or "")
    if not text:
        return ""

    # NFC normalize then force a clean unicode string
    text = unicodedata.normalize("NFC", text)
    text = HTML_TAG_RE.sub("", text)
    text = text.translate(DASH_TRANSLATION)
    text = text.translate(BAD_GLYPH_TRANSLATION)
    # Strip leftover bullet glyphs used as inline markers (we inject &bull; ourselves)
    text = text.replace("•", " ").replace("\u2022", " ")
    text = text.replace("&nbsp;", " ").replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
    # Collapse whitespace but keep intentional single spaces
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\s*\n\s*", " ", text)
    return text.strip()


def _xml_escape(text: str) -> str:
    return (
        _plain(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def _split_bullets(text: str) -> List[str]:
    raw = str(text or "")
    raw = unicodedata.normalize("NFC", raw)
    raw = raw.translate(DASH_TRANSLATION)
    raw = re.sub(r"[•\u2022▪■●]\s*", "\n", raw)
    raw = raw.replace(" - ", "\n")
    parts = re.split(r"[\n\r]+", raw)
    return [_plain(line).lstrip("- ").strip() for line in parts if _plain(line).lstrip("- ").strip()]


def _collect_achievement_lines(payload: Dict[str, Any]) -> List[str]:
    lines: List[str] = []
    for item in payload.get("achievements") or []:
        if isinstance(item, dict):
            line = item.get("activity") or item.get("title") or item.get("name") or item.get("description") or ""
        else:
            line = str(item)
        line = _plain(line)
        if line:
            lines.append(line)

    # Only fall back to volunteer_work when achievements were not provided separately
    if not lines:
        for item in payload.get("volunteer_work") or []:
            if isinstance(item, dict):
                line = item.get("activity") or item.get("title") or item.get("name") or ""
            else:
                line = str(item)
            line = _plain(line)
            if line:
                lines.append(line)
    return lines


def _normalized_skill_rows(payload: Dict[str, Any]) -> List[Tuple[str, List[str]]]:
    """Prefer original skill_groups categories; otherwise bucket into common groups."""
    groups = payload.get("skill_groups") or []
    if groups:
        rows: List[Tuple[str, List[str]]] = []
        for group in groups:
            category = _plain(group.get("category") or "Skills")
            skills = [_plain(s) for s in (group.get("skills") or []) if _plain(s)]
            if skills:
                rows.append((category, skills))
        if rows:
            return rows

    preferred = [
        "Programming Languages",
        "Libraries / Frameworks",
        "Machine Learning & AI",
        "Tools / Platforms",
        "Soft Skills",
    ]
    bucket: Dict[str, List[str]] = {name: [] for name in preferred}
    for skill in payload.get("prioritized_skills") or payload.get("skills") or []:
        cleaned = _plain(skill)
        if not cleaned:
            continue
        bucket[_classify_skill(cleaned)].append(cleaned)

    return [(name, bucket[name]) for name in preferred if bucket[name]]


def _classify_skill(skill: str) -> str:
    key = skill.lower()
    if key in {"python", "c", "c++", "c/c++", "javascript", "java", "typescript", "sql", "go", "rust"}:
        return "Programming Languages"
    if any(token in key for token in ["team", "creativ", "problem", "communicat", "leadership"]):
        return "Soft Skills"
    if any(token in key for token in ["learning", "cnn", "rnn", "lstm", "nlp", "ai", "deep", "transfer"]):
        return "Machine Learning & AI"
    if any(token in key for token in ["colab", "jupyter", "vs code", "git", "github", "docker", "linux"]):
        return "Tools / Platforms"
    return "Libraries / Frameworks"


def _project_title_and_tech(project: Dict[str, Any]) -> Tuple[str, str]:
    title = _plain(project.get("title") or "Project")
    tech = _plain(project.get("tech_stack") or project.get("technologies") or "")
    if not tech and "," in title:
        parts = [p.strip() for p in title.split(",") if p.strip()]
        if len(parts) >= 2:
            title = parts[0]
            tech = ", ".join(parts[1:])
    return title, tech


def extract_languages_from_raw_text(raw_text: str) -> List[Dict[str, str]]:
    """Best-effort parse of a Languages section from original resume text."""
    if not raw_text:
        return []
    match = re.search(
        r"(?is)\blanguages\b\s*(.*?)(?=\n\s*(?:certifications|achievements|projects|skills|education|experience)\b|\Z)",
        raw_text,
    )
    if not match:
        return []
    block = match.group(1).strip()
    lines = [ln.strip() for ln in block.splitlines() if ln.strip()]
    languages: List[Dict[str, str]] = []
    i = 0
    while i < len(lines):
        lang = lines[i]
        level = ""
        if i + 1 < len(lines) and lines[i + 1].lower() in {"native", "fluent", "intermediate", "basic", "professional"}:
            level = lines[i + 1]
            i += 2
        else:
            # "Urdu - Native" / "English: Fluent"
            parts = re.split(r"\s*[-:|]\s*", lang, maxsplit=1)
            if len(parts) == 2 and parts[1].lower() in {"native", "fluent", "intermediate", "basic", "professional"}:
                lang, level = parts[0], parts[1]
            i += 1
        if lang and lang.lower() not in SECTION_META and len(lang) < 40:
            languages.append({"language": lang, "proficiency": level})
    return languages


def extract_achievements_from_raw_text(raw_text: str) -> List[str]:
    if not raw_text:
        return []
    match = re.search(
        r"(?is)\bachievements\b\s*(.*?)(?=\n\s*(?:languages|certifications|projects|skills|education|experience)\b|\Z)",
        raw_text,
    )
    if not match:
        return []
    block = match.group(1).strip()
    lines = []
    for ln in block.splitlines():
        cleaned = _plain(ln).lstrip("-• ").strip()
        if cleaned and cleaned.lower() not in {"achievements", "awards"}:
            lines.append(cleaned)
    return lines


def extract_subtitle_from_raw_text(raw_text: str, name: str = "") -> str:
    if not raw_text:
        return ""
    lines = [ln.strip() for ln in raw_text.splitlines() if ln.strip()]
    if not lines:
        return ""
    # Usually line 0 is name, line 1 is subtitle / headline
    start = 1 if name and lines[0].lower().startswith(name.split()[0].lower()) else 0
    if start == 0 and len(lines[0].split()) <= 4 and "@" not in lines[0]:
        # first line may already be name
        if len(lines) > 1:
            candidate = lines[1]
        else:
            return ""
    else:
        candidate = lines[start] if start < len(lines) else ""
    if not candidate:
        return ""
    if "@" in candidate or candidate.lower().startswith("http") or "github" in candidate.lower():
        return ""
    if len(candidate) > 80:
        return ""
    return _plain(candidate)


def build_cover_letter_pdf(payload: Dict[str, Any]) -> bytes:
    """Build a single-page cover letter PDF with a resume-style contact header.

    Args:
        payload: Cover letter fields including ``header``, ``salutation``,
            ``body_paragraphs``, ``closing``, and optional company/job metadata.

    Returns:
        bytes: Complete PDF document contents.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.6 * inch,
        bottomMargin=0.6 * inch,
        title="Cover Letter",
    )

    base = getSampleStyleSheet()
    name_style = ParagraphStyle(
        "CLName",
        parent=base["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=18,
        textColor=INK,
        alignment=TA_CENTER,
        spaceAfter=3,
        leading=22,
    )
    contact_style = ParagraphStyle(
        "CLContact",
        parent=base["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        textColor=GRAY,
        alignment=TA_CENTER,
        spaceAfter=14,
        leading=13,
    )
    meta_style = ParagraphStyle(
        "CLMeta",
        parent=base["Normal"],
        fontName="Helvetica",
        fontSize=10,
        textColor=INK,
        alignment=TA_LEFT,
        spaceAfter=2,
        leading=13,
    )
    body_style = ParagraphStyle(
        "CLBody",
        parent=base["Normal"],
        fontName="Helvetica",
        fontSize=11,
        textColor=INK,
        alignment=TA_LEFT,
        spaceAfter=10,
        leading=15,
    )
    closing_style = ParagraphStyle(
        "CLClosing",
        parent=base["Normal"],
        fontName="Helvetica",
        fontSize=11,
        textColor=INK,
        alignment=TA_LEFT,
        spaceBefore=4,
        spaceAfter=2,
        leading=15,
    )

    header = payload.get("header") or {}
    name = _plain(
        header.get("candidate_name")
        or payload.get("candidate_name")
        or "Candidate"
    )
    contact_bits = [
        _plain(header.get("email")),
        _plain(header.get("phone")),
        _plain(header.get("location")),
        _plain(header.get("github")),
        _plain(header.get("linkedin")),
    ]
    contact_line = "  |  ".join([bit for bit in contact_bits if bit])

    story: List[Any] = []
    story.append(Paragraph(_xml_escape(name), name_style))
    if contact_line:
        story.append(Paragraph(_xml_escape(contact_line), contact_style))

    company = _plain(payload.get("company_name") or "")
    job_title = _plain(payload.get("job_title") or "")
    if company or job_title:
        story.append(Paragraph(_xml_escape(company or "Hiring Team"), meta_style))
        if job_title:
            story.append(Paragraph(_xml_escape(f"Re: {job_title}"), meta_style))
        story.append(Spacer(1, 10))

    salutation = _plain(payload.get("salutation") or "Dear Hiring Manager,")
    story.append(Paragraph(_xml_escape(salutation), body_style))

    paragraphs = payload.get("body_paragraphs") or []
    if not paragraphs and payload.get("full_text"):
        paragraphs = [p.strip() for p in str(payload.get("full_text")).split("\n\n") if p.strip()]
    for paragraph in paragraphs:
        cleaned = _plain(paragraph)
        if cleaned:
            story.append(Paragraph(_xml_escape(cleaned), body_style))

    closing = _plain(payload.get("closing") or "Sincerely,")
    story.append(Paragraph(_xml_escape(closing), closing_style))
    story.append(Spacer(1, 16))
    story.append(Paragraph(_xml_escape(name), closing_style))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes


def safe_filename_fragment(value: str, fallback: str = "Company") -> str:
    text = _plain(value) or fallback
    text = re.sub(r"[^A-Za-z0-9._-]+", "_", text).strip("._")
    return (text or fallback)[:40]
