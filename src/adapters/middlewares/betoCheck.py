from transformers import BertTokenizer, BertForSequenceClassification
from torch import nn
import torch

# Cargar el modelo BETO preentrenado para clasificación de texto
tokenizer = BertTokenizer.from_pretrained('dccuchile/bert-base-spanish-wwm-cased')
model = BertForSequenceClassification.from_pretrained('dccuchile/bert-base-spanish-wwm-cased', num_labels=2)

# Función para detectar lenguaje ofensivo
def detectar_obscenidades(texto: str) -> bool:
    inputs = tokenizer(texto, return_tensors='pt', padding=True, truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    prediction = torch.argmax(logits, dim=-1).item()
    # Si la predicción es 1, el texto es ofensivo (puedes ajustar esta lógica dependiendo del modelo)
    return prediction == 1

# Ejemplo de uso
if __name__ == "__main__":
    texto = "Tu texto aquí"
    if detectar_obscenidades(texto):
        print("Texto contiene palabras inapropiadas")
    else:
        print("Texto aprobado")
