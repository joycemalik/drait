/** The AIT Hub mark: a sal leaf over moving water, drawn by hand. */
export default function Mark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M16 3.5C9.5 7.5 7 13 8.2 18.6c.8 3.6 3.9 5.6 7.8 5.6s7-2 7.8-5.6C25 13 22.5 7.5 16 3.5Z"
        fill="var(--sal)"
        opacity="0.9"
      />
      <path d="M16 6.5c-.6 5.6-.4 11.4.2 16.6" stroke="var(--paper)" strokeWidth="1.1" strokeLinecap="round" />
      <path
        d="M3.5 25.5c2.2-1.6 4.4-1.6 6.6 0s4.4 1.6 6.6 0 4.4-1.6 6.6 0 3.6 1.4 5.2.4"
        stroke="var(--river)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M6.5 29c1.8-1.1 3.6-1.1 5.4 0s3.6 1.1 5.4 0 3.6-1.1 5.4 0"
        stroke="var(--river)"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
