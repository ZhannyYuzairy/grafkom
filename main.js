const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let angleX = 0;
let angleY = 0;

// Titik 3D kotak (bukan kubus) - ukuran bebas
const points = [
  {x: -100, y: -50, z: -50},
  {x:  100, y: -50, z: -50},
  {x:  100, y:  50, z: -50},
  {x: -100, y:  50, z: -50},
  {x: -100, y: -50, z:  50},
  {x:  100, y: -50, z:  50},
  {x:  100, y:  50, z:  50},
  {x: -100, y:  50, z:  50},
];

// Koneksi antar titik (index ke array `points`)
const edges = [
  [0,1],[1,2],[2,3],[3,0], // belakang
  [4,5],[5,6],[6,7],[7,4], // depan
  [0,4],[1,5],[2,6],[3,7], // samping
];

function rotate(p, angleX, angleY) {
  // rotasi sumbu Y
  let x = p.x * Math.cos(angleY) - p.z * Math.sin(angleY);
  let z = p.x * Math.sin(angleY) + p.z * Math.cos(angleY);
  p.x = x;
  p.z = z;

  // rotasi sumbu X
  let y = p.y * Math.cos(angleX) - p.z * Math.sin(angleX);
  z = p.y * Math.sin(angleX) + p.z * Math.cos(angleX);
  p.y = y;
  p.z = z;

  return p;
}

function project(p) {
  return {
    x: p.x + canvas.width / 2,
    y: -p.y + canvas.height / 2
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const rotated = points.map(p => rotate({...p}, angleX, angleY));
  const projected = rotated.map(project);

  ctx.beginPath();
  for (let [a, b] of edges) {
    const p1 = projected[a];
    const p2 = projected[b];
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
  }
  ctx.strokeStyle = 'green';
  ctx.stroke();
}

document.addEventListener('keydown', e => {
  if (e.key === 'a') angleY -= 0.1;
  if (e.key === 'd') angleY += 0.1;
  if (e.key === 'w') angleX -= 0.1;
  if (e.key === 's') angleX += 0.1;
  draw();
});

// Gambar awal
draw();
