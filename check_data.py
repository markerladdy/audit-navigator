import json

p = r"C:\Users\MuMa Studio\auditnavigator\downloads\slides_data.json"
with open(p, encoding="utf-8") as f:
    data = json.load(f)

total = data["total"]
print(f"Total: {total}")
print(f"Data size: {len(json.dumps(data, ensure_ascii=False))} chars")
