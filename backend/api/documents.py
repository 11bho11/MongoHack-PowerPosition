from fastapi import APIRouter, UploadFile, File, HTTPException
from ingestion.chunker import chunk_text
from ingestion.embedder import embed_and_store

router = APIRouter()


@router.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        content = (await file.read()).decode("utf-8")
        source_url = file.filename or "uploaded_file"
        chunks = chunk_text(content, source_url)
        count = embed_and_store(chunks)
        return {"status": "ok", "chunks_stored": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
