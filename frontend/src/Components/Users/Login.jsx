import { useFormik } from "formik";
import { loginSchema } from "../Schema/Index";
import { useAuth } from "../../contexts/useAuth";
import Modal from "react-bootstrap/Modal";


const initialValues = {
  username: "",
  password: "",
};

const Login = ({ onClose, onLoginSuccess }) => {
  const { login_user, lastAttemptedPage } = useAuth();

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    onSubmit: async ({ username, password }, { setSubmitting }) => {
      const success = await login_user(username, password);
      try {
        if (success) {
          onClose();
          onLoginSuccess();
        }
        setSubmitting(false);
      } catch (error) {
        
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
            Login on StayEasy
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
              {
                <p className="form-error" style={{ color: "red" }}>
                  {errors.username}
                </p>
              }
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
              {
                <p className="form-error" style={{ color: "red" }}>
                  {errors.password}
                </p>
              }
            </div>
            <button type="submit" className="btn btn-success">
              Login
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default Login;
