import Image from "next/image";
import { BLUR } from "@/lib/content";

export default function CurtainImage() {
  return (
    <section className="curtain-panel">
      <div className="wrap" style={{ width: "100%" }}>
        <figure className="fig">
          <div className="curtain" data-curtain>
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=80"
              alt="Interior of a U Thant residence"
              fill
              sizes="(max-width:1600px) 100vw, 1600px"
              placeholder="blur"
              blurDataURL={BLUR}
              style={{ objectFit: "cover" }}
            />
          </div>
          <figcaption className="cap">
            <span data-i18n="curtain.caption">U Thant Residence — Living</span>
            <span className="mono">01 / Collection</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
