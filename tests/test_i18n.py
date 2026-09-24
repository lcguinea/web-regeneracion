#!/usr/bin/env python3
"""Comprobaciones estructurales focalizadas para la internacionalización."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
FILES = ["es.json", "ca.json", "en.json", "fr.json", "it.json"]


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def leaf_map(value: Any, path: tuple[str, ...] = ()) -> dict[tuple[str, ...], Any]:
    leaves: dict[tuple[str, ...], Any] = {}
    if isinstance(value, dict):
        for key, child in value.items():
            leaves.update(leaf_map(child, path + (key,)))
    elif isinstance(value, list):
        leaves[path + ("#length",)] = len(value)
        for index, child in enumerate(value):
            leaves.update(leaf_map(child, path + (str(index),)))
    else:
        leaves[path] = value
    return leaves


def text_values(value: Any) -> list[str]:
    if isinstance(value, dict):
        return [text for child in value.values() for text in text_values(child)]
    if isinstance(value, list):
        return [text for child in value for text in text_values(child)]
    return [value] if isinstance(value, str) else []


def main() -> None:
    dictionaries = {}
    for filename in FILES:
        try:
            dictionaries[filename] = json.loads((CONTENT / filename).read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as error:
            fail(f"no se pudo leer {filename}: {error}")

    reference = leaf_map(dictionaries["es.json"])
    reference_paths = set(reference)
    for filename, dictionary in dictionaries.items():
        leaves = leaf_map(dictionary)
        if set(leaves) != reference_paths:
            missing = sorted(reference_paths - set(leaves))
            extra = sorted(set(leaves) - reference_paths)
            fail(f"{filename} no comparte las mismas claves/rutas; faltan={missing[:3]}, sobran={extra[:3]}")
        for path, value in leaves.items():
            if path[-1] == "#length" and value != reference[path]:
                fail(f"longitud de array distinta en {filename}: {'.'.join(path[:-1])}")
            if isinstance(value, str) and not value.strip():
                fail(f"texto vacío en {filename}: {'.'.join(path)}")

    spanish_long_paths = [
        path for path, text in reference.items()
        if isinstance(text, str) and len(text) > 20
    ]
    for filename in FILES[1:]:
        translated = leaf_map(dictionaries[filename])
        different = sum(reference[path] != translated[path] for path in spanish_long_paths)
        if different / len(spanish_long_paths) < 0.80:
            fail(f"{filename} parece una copia de es.json ({different}/{len(spanish_long_paths)} textos largos difieren)")

    for filename, dictionary in dictionaries.items():
        all_text = "\n".join(text_values(dictionary))
        for institutional_name in ("Gran Logia de España", "Regeneración Nº 132"):
            if institutional_name not in all_text:
                fail(f"{filename} no conserva {institutional_name!r}")

    required = [
        "app/[lang]/layout.tsx",
        "app/[lang]/page.tsx",
        "app/[lang]/contacto/page.tsx",
        "app/sitemap.ts",
        "docs/i18n.md",
    ]
    for relative in required:
        if not (ROOT / relative).is_file():
            fail(f"falta {relative}")
    for relative in ("app/layout.tsx", "app/page.tsx"):
        if (ROOT / relative).exists():
            fail(f"no debe existir {relative}")

    forbidden_strings = [
        "Escribir a la Logia",
        "Enviar consulta",
        "Empecemos por escucharte",
        "Abrir menú",
        "Selecciona una opción",
        "Contenido pendiente de confirmación",
        "Oriente de Valencia · Gran Logia",
    ]
    app_sources = list((ROOT / "app").rglob("*.tsx"))
    for source in app_sources:
        text = source.read_text(encoding="utf-8")
        for forbidden in forbidden_strings:
            if forbidden in text:
                fail(f"texto visible en español dentro de {source.relative_to(ROOT)}: {forbidden!r}")

    for source in [*(ROOT / "app").rglob("*.tsx"), *(ROOT / "app").rglob("*.ts")]:
        if source.relative_to(ROOT).as_posix() == "app/lib/i18n.ts":
            continue
        text = source.read_text(encoding="utf-8")
        if "content/es.json" in text:
            fail(f"importación directa de content/es.json en {source.relative_to(ROOT)}")

    contact_source = (ROOT / "app/lib/contact.ts").read_text(encoding="utf-8")
    if "Quiero conocer la Masonería" in contact_source:
        fail("app/lib/contact.ts aún contiene el motivo visible antiguo")

    i18n_source = (ROOT / "app/lib/i18n.ts").read_text(encoding="utf-8")
    for token in ("'es'", "'va'", "'en'", "'fr'", "'it'", "ca-ES-valencia"):
        if token not in i18n_source:
            fail(f"app/lib/i18n.ts no menciona {token}")

    config = (ROOT / "next.config.mjs").read_text(encoding="utf-8")
    for redirect in ("destination: '/es'", "destination: '/es/contacto'"):
        if redirect not in config:
            fail(f"next.config.mjs no contiene {redirect}")

    print("OK i18n")


if __name__ == "__main__":
    main()
