(function () {
  "use strict";
  const POST_TYPES = ["Educational", "Behind the scenes", "Tip/quick win", "Story", "Q&A", "Repost/curated"];
  const ANGLES = ["Myth bust", "How-to", "List", "Story", "Hot take"];
  function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  window.NSB_CONTENT_CALENDAR = {
    generate(inputs, seed) {
      const rnd = window.NSB_UTILS.seededPRNG(seed || 12345);
      const niche = (inputs.niche || "your niche").slice(0, 50);
      const rows = DAYS.map((day, i) => ({
        day,
        type: pick(POST_TYPES, rnd),
        angle: pick(ANGLES, rnd) + ": " + niche
      }));
      return rows;
    }
  };
})();
