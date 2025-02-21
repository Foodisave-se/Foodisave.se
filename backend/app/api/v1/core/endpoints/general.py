from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status
from sqlalchemy import delete, insert, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload

from app.api.v1.core.models import (
    Company,
    CompanyType,
    Course,
    User,
    UserCourseEnrollment,
)
from app.api.v1.core.schemas import (
    CompanySchema,
    CompanyTypeSchema,
    CourseSchema,
    UserSchema,
)
from app.db_setup import get_db

router = APIRouter(tags=["dashboard"], prefix="/dashboard")


@router.get("/company", status_code=200)
def list_companies(db: Session = Depends(get_db)):
    programs = db.scalars(select(Company)).all()
    if not programs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No companies found"
        )
    return programs


@router.post(
    "/company",
    status_code=status.HTTP_201_CREATED,
    response_model=CompanySchema,
)
def add_company(company: CompanySchema, db: Session = Depends(get_db)):
    try:
        if company.company_type_id:
            company_type = db.scalars(
                select(CompanyType).where(
                    CompanyType.id == company.company_type_id)
            ).one_or_none()

            if not company_type:
                raise HTTPException(
                    status_code=404,
                    detail=f"Company type with id {company.company_type_id} not found",
                )

        db_company = Company(**company.model_dump(exclude_unset=True))
        db.add(db_company)
        db.commit()
        return db_company

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="Company name already exists")


@router.get("/company/{id}")
def company_detail(id: int, db: Session = Depends(get_db)):
    """
    Detail endpoint for company, all fields
    """
    result = db.scalars(select(Company).where(Company.id == id)).first()
    if not result:
        return HTTPException(status_code=404, detail="Company not found")
    return result


@router.delete("/company/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_company(company_id: int, db: Session = Depends(get_db)):
    """
    Deletes a company based on an id
    """
    db_company = db.scalars(select(Company).where(
        Company.id == company_id)).first()
    if db_company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    db.delete(db_company)
    db.commit()
    return {}


@router.put("/company/{company_id}")
def update_company(
    company_id: int, company_info: CompanySchema, db: Session = Depends(get_db)
):
    db_company = db.scalars(
        select(Company).where(Company.id == company_id)
    ).one_or_none()
    if not db_company:
        raise HTTPException(status_code=404, detail="Company not found")

    update_name = company_info.model_dump().get("name")
    if update_name:
        existing = db.scalars(
            select(Company).where(Company.name == update_name)
        ).first()
        if existing:
            raise HTTPException(
                status_code=400, detail="Company name already exists")

    try:
        for key, value in company_info.model_dump(exclude_unset=True).items():
            setattr(db_company, key, value)
        db.commit()
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Invalid company type id")

    return db_company


@router.post("/companytype", status_code=201)
def add_company_type(company_type: CompanyTypeSchema, db: Session = Depends(get_db)):
    db_company = CompanyType(**company_type.model_dump())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company


@router.get("/full/company", status_code=200)
def list_companies_full(db: Session = Depends(get_db)):
    """
    List companies and their companytype
    This also includes a join to fetch data for company types.
    """
    companies = db.scalars(
        select(Company).options(joinedload(Company.company_type))
    ).all()
    return companies


@router.get("/companytest", status_code=200)
def list_companies_test(db: Session = Depends(get_db)):
    companies = db.scalars(
        select(Company).options(selectinload(Company.company_type))
    ).all()

    # Later in our code or template, we try to access company types:
    for company in companies:
        print(
            f"Company {company.name} is of type: {company.company_type.name}")


@router.get("/companytype/full/{id}")
def companytype_full(id: int, db: Session = Depends(get_db)):
    """
    Fetching all companies associated with a company type
    \f
    We use joinedload for this (we could also use selectinload)
    Both above are loading strategies when we work with relationships
    """
    result = db.scalars(
        select(CompanyType)
        .where(CompanyType.id == id)
        .options(joinedload(CompanyType.companies))
    ).first()
    return result


@router.post(
    "/course", response_model=CourseSchema, status_code=status.HTTP_201_CREATED
)
def create_course(course: CourseSchema, db: Session = Depends(get_db)):
    """
    Create a course
    """
    db_course = Course(**course.model_dump())
    db.add(db_course)
    db.commit()
    return db_course


@router.get("/course")
def list_courses(db: Session = Depends(get_db)) -> list[CourseSchema]:
    """
    List all courses
    """
    courses = db.scalars(select(Course)).all()
    return courses


@router.get("/user", response_model=list[UserSchema])
def list_users(db: Session = Depends(get_db)) -> list[UserSchema]:
    """
    List all users and their course enrollments
    """
    users = db.scalars(select(User)).all()
    return users


@router.post("/user", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def create_user(user: UserSchema, db: Session = Depends(get_db)):
    """
    Create a user and optionally register them to courses
    """
    db_user = User(**user.model_dump(exclude={"courses"}))
    db.add(db_user)

    # If there are course enrollments, create those associations
    if user.courses:
        for enrollment in user.courses:
            db_enrollment = UserCourseEnrollment(
                user=db_user, **enrollment.model_dump()
            )
            db.add(db_enrollment)

    db.commit()
    return db_user
