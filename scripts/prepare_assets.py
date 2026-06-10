from __future__ import annotations

import json
import shutil
import unicodedata
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
GALLERY = ROOT / "public" / "media" / "gallery"
SUPPORT = ROOT / "public" / "media" / "support"
DOCUMENTS = ROOT / "public" / "documents"
MANIFEST = ROOT / "src" / "content" / "media-manifest.json"


def slug(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    return "-".join(
        part for part in "".join(c.lower() if c.isalnum() else " " for c in ascii_value).split()
    )


def category_for(number: int) -> str:
    if 3965 <= number <= 3982:
        return "infraestruturas"
    if 3983 <= number <= 3987:
        return "navios"
    if number in {3999, 4000}:
        return "operacoes"
    return "pessoas"


def alt_for(number: int, category: str) -> str:
    descriptions = {
        "infraestruturas": f"Infra-estruturas e parque de contentores do Porto de Bissau, fotografia {number}",
        "navios": f"Navio e actividade marítima no Porto de Bissau, fotografia {number}",
        "operacoes": f"Actividade operacional e trabalho portuário da APGB, fotografia {number}",
        "pessoas": f"Colaboradores e responsáveis da APGB no Porto de Bissau, fotografia {number}",
    }
    return descriptions[category]


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
    for directory in (GALLERY, SUPPORT, DOCUMENTS):
        directory.mkdir(parents=True, exist_ok=True)

    gallery = []
    for source in sorted(ROOT.glob("DSC_*.JPG")):
        number = int(source.stem.split("_")[1])
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

