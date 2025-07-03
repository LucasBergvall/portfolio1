from sqlalchemy import create_engine


DATABASE_URL = "mysql+pymysql://id235:pw235@175.126.37.21:13306/db235"


engine = create_engine(DATABASE_URL)