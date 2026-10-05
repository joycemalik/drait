import Link from "next/link";

/** Explains why sign-in didn't work, shown after the OAuth round trip. */
export default function SignInNotice({ reason }: { reason: string }) {
  const collegeOnly = reason === "college-only";
  return (
    <div
      role="alert"
      className="leaf"
      style={{
        position: "absolute",
        top: "5rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
        width: "min(34rem, calc(100% - 2rem))",
        padding: "0.9rem 1.2rem",
        fontSize: "0.92rem",
        lineHeight: 1.55,
      }}
    >
      <strong style={{ color: "var(--laterite)" }}>{collegeOnly ? "Use your college account" : "Sign-in didn't finish"}</strong>
      <br />
      {collegeOnly ? (
        <>
          AIT Hub is only for Dr. AIT students. Sign in again and pick your college Google account (ending in{" "}
          <code>drait.edu.in</code>).{" "}
        </>
      ) : (
        <>Something went wrong with Google sign-in. Please try again. </>
      )}
      <Link href="/about#sign-in">Who can sign in</Link>
    </div>
  );
}
