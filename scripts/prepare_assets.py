from __future__ import annotations

import json
import shutil
import unicodedata
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
GALLERY = ROOT / "public" / "media" / "gallery"
SUPPORT = ROOT / "public" / "media" / "support"
SECTION_HEROES = ROOT / "public" / "media" / "section-heroes"
DOCUMENTS = ROOT / "public" / "documents"
MANIFEST = ROOT / "src" / "content" / "media-manifest.json"
DREDGING_SOURCE = Path(
    "/Volumes/NO NAME/FOTOS DE DRAGAGEM DO PORTO DA APGB PARA MINISTRO DOS TRANSPORTES E TELECOMUNICAÇÕES"
)

EXCLUDED_GALLERY_NUMBERS = {
    3934,
    3937,
    3938,
    3941,
    3949,
    3956,
    3960,
    3961,
    3962,
    3963,
    3964,
}

MANUAL_GALLERY = [
    {
        "source": "apgb1.jpeg",
        "filename": "apgb1.webp",
        "category": "pessoas",
        "alt": "Responsáveis da APGB durante uma comunicação institucional junto ao cais",
    },
    {
        "source": "apgb2.jpeg",
        "filename": "apgb2.webp",
        "category": "pessoas",
        "alt": "Responsáveis da APGB durante uma visita a uma embarcação no Porto de Bissau",
    },
]

DREDGING_GALLERY_NUMBERS = [
    9207,
    9345,
    9638,
    9580,
    9579,
    9565,
    9392,
    9388,
    9507,
    9496,
    9461,
    9426,
    9418,
    9417,
    9408,
    9347,
    9393,
    9384,
    9552,
    9544,
    9209,
    9626,
    9597,
    9245,
]

SECTION_HERO_SOURCES = {
    "autoridade-portuaria": ROOT / "DSC_3989.JPG",
    "porto-de-bissau": ROOT / "DSC_3978.JPG",
    "negocio-portuario": ROOT / "DSC_4000.JPG",
    "area-social": DREDGING_SOURCE / "IMG_9418.JPG",
    "projectos": DREDGING_SOURCE / "IMG_9345.JPG",
}


def slug(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    return "-".join(
        part for part in "".join(c.lower() if c.isalnum() else " " for c in ascii_value).split()
    )


def category_for(number: int) -> str:
    if 3965 <= number <= 3982:
        return "infraestruturas"
    if number == 3989:
        return "infraestruturas"
    if 3983 <= number <= 3987:
        return "navios"
    if number in {3999, 4000}:
        return "operacoes"
    return "pessoas"


def alt_for(number: int, category: str) -> str:
    if number == 3989:
        return "Edifício da Administração dos Portos da Guiné-Bissau no Porto de Bissau"
    if number == 4003:
        return "Director-Geral da APGB no seu gabinete"

    descriptions = {
        "infraestruturas": f"Infra-estruturas e parque de contentores do Porto de Bissau, fotografia {number}",
        "navios": f"Navio e actividade marítima no Porto de Bissau, fotografia {number}",
        "operacoes": f"Actividade operacional e trabalho portuário da APGB, fotografia {number}",
        "pessoas": f"Colaboradores e responsáveis da APGB no Porto de Bissau, fotografia {number}",
    }
    return descriptions[category]


def dredging_category(number: int) -> str:
    if number in {9345, 9638, 9347}:
        return "navios"
    if number in {9426, 9418, 9417, 9408, 9597, 9626}:
        return "pessoas"
    return "operacoes"


def dredging_alt(number: int) -> str:
    descriptions = {
        9207: "Faixa institucional do início dos trabalhos de dragagem do Porto de Bissau",
        9345: "Equipamento de dragagem e rebocador no Porto de Bissau",
        9638: "Grua flutuante preparada para os trabalhos de dragagem",
        9580: "Responsáveis durante a visita ao equipamento de dragagem",
        9579: "Delegação institucional junto ao equipamento de dragagem",
        9565: "Apresentação técnica do equipamento de dragagem à delegação",
        9392: "Delegação oficial durante a cerimónia de início da dragagem",
        9388: "Responsáveis percorrem o cais durante o início dos trabalhos de dragagem",
        9507: "Intervenção oficial na cerimónia de início da dragagem",
        9496: "Discurso durante a cerimónia de início dos trabalhos de dragagem",
        9461: "Intervenção pública junto a um navio no Porto de Bissau",
        9426: "Actuação cultural na cerimónia de início da dragagem",
        9418: "Dança tradicional durante a cerimónia no Porto de Bissau",
        9417: "Grupo cultural em actuação no Porto de Bissau",
        9408: "Grupo de dança tradicional durante a cerimónia de dragagem",
        9347: "Rebocador e equipamento flutuante no Porto de Bissau",
        9393: "Delegação oficial junto a um navio no cais",
        9384: "Cumprimento institucional durante a cerimónia de dragagem",
        9552: "Brinde institucional na cerimónia de início da dragagem",
        9544: "Diálogo entre responsáveis e trabalhadores portuários",
        9209: "Responsáveis de segurança durante a cerimónia no Porto de Bissau",
        9626: "Inspectores da APGB junto ao equipamento de dragagem",
        9597: "Responsáveis da APGB no Porto de Bissau",
        9245: "Delegação institucional percorre o cais do Porto de Bissau",
    }
    return descriptions[number]


def convert_image(source: Path, destination: Path, max_width: int = 1800) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image = image.convert("RGB")
        if image.width > max_width:
            height = round(image.height * max_width / image.width)
            image = image.resize((max_width, height), Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=78, method=6)


def copy_document(source: Path) -> dict[str, str]:
    destination = DOCUMENTS / f"{slug(source.stem)}.pdf"
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)
    return {
        "title": source.stem.replace("_", " "),
        "url": f"/documents/{destination.name}",
    }


def main() -> None:
    for directory in (GALLERY, SUPPORT, SECTION_HEROES, DOCUMENTS):
        directory.mkdir(parents=True, exist_ok=True)

    gallery = []
    for source in sorted(ROOT.glob("DSC_*.JPG")):
        number = int(source.stem.split("_")[1])
        if number in EXCLUDED_GALLERY_NUMBERS:
            continue
        category = category_for(number)
        destination = GALLERY / f"{source.stem.lower()}.webp"
        convert_image(source, destination)
        gallery.append(
            {
                "source": source.name,
                "url": f"/media/gallery/{destination.name}",
                "category": category,
                "alt": alt_for(number, category),
            }
        )

    for item in MANUAL_GALLERY:
        destination = GALLERY / item["filename"]
        if destination.exists():
            gallery.append(
                {
                    "source": item["source"],
                    "url": f"/media/gallery/{destination.name}",
                    "category": item["category"],
                    "alt": item["alt"],
                }
            )

    for number in DREDGING_GALLERY_NUMBERS:
        source = DREDGING_SOURCE / f"IMG_{number}.JPG"
        destination = GALLERY / f"dragagem-img-{number}.webp"
        if source.exists():
            convert_image(source, destination)
        if destination.exists():
            gallery.append(
                {
                    "source": f"dragagem/IMG_{number}.JPG",
                    "url": f"/media/gallery/{destination.name}",
                    "category": dredging_category(number),
                    "alt": dredging_alt(number),
                }
            )

    for name, source in SECTION_HERO_SOURCES.items():
        destination = SECTION_HEROES / f"{name}.webp"
        if source.exists():
            convert_image(source, destination, max_width=2200)

    support_sources = [
        ROOT / "organigrama 3.png",
        ROOT / "organigrama-2.png",
        ROOT / "cais.jpg",
        ROOT / "trafego directo.jpg",
        ROOT / "TARIFA DE ESTIVA E DESESTIVA.jpg",
        ROOT / "Tarifa actualização do porto.jpg",
        ROOT / "Tarifa de armazenagem de mercadorias 1.jpg",
        ROOT / "Tarifa de trafego inderectos.jpg",
        ROOT / "armazenamento de contentor vazio.jpg",
        ROOT / "TABELA VIII - Para toda a carga geral.jpg",
        ROOT / "TABELA IX - Para carga e descarga de sacarias.jpg",
        ROOT / "CONTEUDOS" / "porto apgb.png",
    ]
    support = []
    for source in support_sources:
        if not source.exists():
            continue
        destination = SUPPORT / f"{slug(source.stem)}.webp"
        convert_image(source, destination, max_width=2200)
        support.append({"title": source.stem, "url": f"/media/support/{destination.name}"})

    logo_source = ROOT / "logo" / "logo final 300.png"
    if logo_source.exists():
        shutil.copy2(logo_source, ROOT / "public" / "media" / "logo-apgb.png")

    document_sources = [
        ROOT / "CONTEUDOS" / "Estatuto APGB_compressed-min.pdf",
        ROOT / "CONTEUDOS" / "Estatuto Empresa APGB.pdf",
        ROOT / "CONTEUDOS" / "Lista de projectos de investimento disponiveis - 2022.pdf",
        ROOT / "CONTEUDOS" / "STATUS DE L'APGB.pdf",
        ROOT / "CONTEUDOS" / "scan.pdf",
        ROOT / "CONTEUDOS" / "scan0760.pdf",
        ROOT / "CONTEUDOS" / "scan0795.pdf",
        ROOT / "REGULAMENTO TARIFAS E TARIFARIO.pdf",
        ROOT / "organigrama 3.pdf",
        ROOT / "organigrama.pdf",
    ]
    documents = [copy_document(source) for source in document_sources if source.exists()]

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(
        json.dumps(
            {"gallery": gallery, "support": support, "documents": documents},
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
