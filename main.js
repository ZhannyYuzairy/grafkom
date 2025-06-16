const canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d'),
      W = canvas.width, H = canvas.height;

let mode = 1, rotX = 0, rotY = 0;

const nodes = [
  [-2,-1,-1.5],[-2,-1,1.5],[-2,1,-1.5],[-2,1,1.5],
  [2,-1,-1.5],[2,-1,1.5],[2,1,-1.5],[2,1,1.5]
];
const edges = [
  [0,1],[1,3],[3,2],[2,0],
  [4,5],[5,7],[7,6],[6,4],
  [0,4],[1,5],[2,6],[3,7]
];
const faces = [
  [0,1,3,2],[4,5,7,6],
  [0,1,5,4],[2,3,7,6],
  [0,2,6,4],[1,3,7,5]
];

function rotate([x, y, z]) {
  const sx = Math.sin(rotX), cx = Math.cos(rotX);
  const sy = Math.sin(rotY), cy = Math.cos(rotY);

  const y2 = y * cx - z * sx;
  const z2 = y * sx + z * cx;
  const x2 = x * cy - z2 * sy;
  const z3 = x * sy + z2 * cy;

  return [x2, y2, z3];
}

function project([x, y]) {
  const s = 120;
  return [x * s + W / 2, -y * s + H / 2];
}

function faceCentroidZ(face) {
  let sumZ = 0;
  for (const i of face) {
    sumZ += rotate(nodes[i])[2];
  }
  return sumZ / face.length;
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  const proj = nodes.map(n => project(rotate(n)));
  const visFaces = faces.map(f => faceCentroidZ(f) < 0);

  for (const e of edges) {
    if (mode === 2) {
      let visible = faces.some((f, idx) =>
        visFaces[idx] &&
        f.includes(e[0]) &&
        f.includes(e[1])
      );
      if (!visible) continue;
    }
    const [p, q] = [proj[e[0]], proj[e[1]]];
    ctx.beginPath();
    ctx.moveTo(...p);
    ctx.lineTo(...q);
    ctx.strokeStyle = '#006400';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function animate() {
  draw();
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('keydown', e => {
  const stp = Math.PI / 90;
  if (e.key.toLowerCase() === 'a') rotY -= stp;
  if (e.key.toLowerCase() === 'd') rotY += stp;
  if (e.key.toLowerCase() === 'w') rotX -= stp;
  if (e.key.toLowerCase() === 's') rotX += stp;
});

document.getElementById('part1').addEventListener('click', () => {
  mode = 1;
  updateUI(1);
});
document.getElementById('part2').addEventListener('click', () => {
  mode = 2;
  updateUI(2);
});

function updateUI(active) {
  document.querySelectorAll('#controls button').forEach(btn => {
    btn.classList.toggle('active', btn.id === 'part' + active);
  });
}
