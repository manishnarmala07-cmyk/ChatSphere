import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../api/axios";

function VerifyOtp() {
  const navigate =
    useNavigate();

  const [otp,
    setOtp] =
    useState("");

  const [error,
    setError] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [timeLeft,
    setTimeLeft] =
    useState(300);

  // ==================
  // TIMER
  // ==================

  useEffect(() => {
    const timer =
      setInterval(() => {
        setTimeLeft(
          (prev) => {
            if (
              prev <= 1
            ) {
              clearInterval(
                timer
              );
              return 0;
            }

            return (
              prev - 1
            );
          }
        );
      }, 1000);

    return () =>
      clearInterval(
        timer
      );
  }, []);

  const formatTime =
    (
      seconds
    ) => {
      const mins =
        Math.floor(
          seconds /
            60
        );

      const secs =
        seconds %
        60;

      return `${mins
        .toString()
        .padStart(
          2,
          "0"
        )}:${secs
        .toString()
        .padStart(
          2,
          "0"
        )}`;
    };

  // ==================
  // VERIFY OTP
  // ==================

  const handleVerify =
    async () => {
      try {
        setLoading(
          true
        );

        setError("");

        const pendingUser =
          JSON.parse(
            sessionStorage.getItem(
              "pendingUser"
            )
          );

        if (
          !pendingUser
        ) {
          setError(
            "Registration data not found"
          );

          return;
        }

        await api.post(
          "/otp/verify",
          {
            email:
              pendingUser.email,
            otp,
          }
        );

        await api.post(
          "/auth/register",
          pendingUser
        );

        sessionStorage.removeItem(
          "pendingUser"
        );

        alert(
          "Account created successfully"
        );

        navigate(
          "/login"
        );
      } catch (
        error
      ) {
        setError(
          error.response
            ?.data
            ?.message ||
            "OTP verification failed"
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  // ==================
  // RESEND OTP
  // ==================

  const resendOtp =
    async () => {
      try {
        const pendingUser =
          JSON.parse(
            sessionStorage.getItem(
              "pendingUser"
            )
          );

        if (
          !pendingUser
        ) {
          setError(
            "Registration data not found"
          );
          return;
        }

        await api.post(
          "/otp/send",
          {
            email:
              pendingUser.email,
          }
        );

        setTimeLeft(
          300
        );

        alert(
          "OTP resent successfully"
        );
      } catch (
        error
      ) {
        setError(
          error.response
            ?.data
            ?.message ||
            "Failed to resend OTP"
        );
      }
    };

  return (
    <div className="container mt-5">

      <h2>
        Verify OTP
      </h2>

      <p>
        Enter the OTP sent to your email.
      </p>

      <div className="mb-3">
        <strong>
          Expires in:
        </strong>{" "}
        {formatTime(
          timeLeft
        )}
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <input
        className="form-control mb-3"
        placeholder="Enter OTP"
        value={otp}
        maxLength={6}
        onChange={(
          e
        ) =>
          setOtp(
            e.target
              .value
          )
        }
      />

      <button
        className="btn btn-success me-2"
        disabled={
          loading
        }
        onClick={
          handleVerify
        }
      >
        {loading
          ? "Verifying..."
          : "Verify OTP"}
      </button>

      <button
        className="btn btn-outline-primary"
        onClick={
          resendOtp
        }
      >
        Resend OTP
      </button>

    </div>
  );
}

export default VerifyOtp;