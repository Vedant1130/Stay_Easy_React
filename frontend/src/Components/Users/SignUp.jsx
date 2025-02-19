import { useFormik } from "formik";
import { signupSchema } from "../Schema/Index";
import { register } from "../../api";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";

const initialValues = {
  username: "",
  email: "",
  password: "",
};

const SignUp = ({ onClose }) => {
  const nav = useNavigate();
  const { setShowLoginPopup } = useAuth();

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: signupSchema,
    onSubmit: async ({ username, email, password }) => {
      const success = await register(username, email, password);
      if (success) {
        setShowLoginPopup(true);
        nav("/");
        onClose();
      }
    },
  });

  return (
    <>
      <Modal
        show={true}
        onHide={onClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Sign Up on StayEasy
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="mb-5" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                name="username"
                id="username"
                type="text"
                className="form-control"
                value={values.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="form-error" style={{ color: "red" }}>
                  {errors.username}
                </p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                name="email"
                id="email"
                type="email"
                className="form-control"
                value={values.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="form-error" style={{ color: "red" }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                name="password"
                id="password"
                type="password"
                className="form-control"
                value={values.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="form-error" style={{ color: "red" }}>
                  {errors.password}
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-success">
              Sign Up
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SignUp;
