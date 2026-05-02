from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk_text(text: str, source_url: str) -> list[dict]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        length_function=len,
    )
    chunks = splitter.split_text(text)
    return [
        {"content": chunk, "chunk_index": i, "source_url": source_url}
        for i, chunk in enumerate(chunks)
    ]
