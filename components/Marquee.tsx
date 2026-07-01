import { MARQUEE } from "@/lib/content";

export default function Marquee() {
  const line = (
    <span>
      {MARQUEE.map((m, i) => (
        <span key={i}>
          {m} <i>·</i>{" "}
        </span>
      ))}
    </span>
  );
  return (
    <div className="marquee" aria-hidden>
      <div className="track" id="marquee">
        {line}
        {line}
      </div>
    </div>
  );
}
