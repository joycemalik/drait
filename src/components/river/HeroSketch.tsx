"use client";
import "./river.css";
import { useEffect, useState } from "react";

/**
 * Loads the hand-drawn campus sketch from its own cached file and places it inline,
 * so it can use the page's ink colours and draw itself in, without weighing down the HTML.
 */
export default function HeroSketch() {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    let live = true;
    fetch("/sketch/campus.svg")
      .then((r) => (r.ok ? r.text() : ""))
      .then((t) => live && setSvg(t))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return <div className="hero-sketch-art" dangerouslySetInnerHTML={{ __html: svg }} />;
}
