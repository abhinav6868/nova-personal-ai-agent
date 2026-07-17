from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/")
def root():
    return {
        "message": "Nova API is running"
    }


@router.get("/health")
def health():
    return {
        "status": "healthy",
        "agent": True,
        "memory": True,
        "scheduler": True,
    }