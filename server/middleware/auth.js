import jwt from "jsonwebtoken";

const secret = 'c30b0911a4f8fc2bbaf37754287c39060508a935';

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    let decodedData;

    if (token) {      
      decodedData = jwt.verify(token, secret);

      req.body.user = decodedData?.id;
    }  

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default auth;