import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container mt-5">

      <div className="text-center">

        <h1 className="mb-3">
          ChatSphere
        </h1>

        <p className="lead">
          Real-Time Messaging Platform
        </p>

        <div className="mt-4">
          <Link
            to="/login"
            className="btn btn-primary me-3"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="btn btn-success"
          >
            Register
          </Link>
        </div>

      </div>

      <hr className="my-5" />

      <div className="row">

        <div className="col-md-4">
          <div className="card p-3">
            <h5>
              Private Chat
            </h5>

            <p>
              Real-time one-to-one messaging using Socket.IO.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h5>
              Group Chat
            </h5>

            <p>
              Create groups, invite users and collaborate.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h5>
              Secure Messaging
            </h5>

            <p>
              AES encrypted message storage with JWT security.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Home;