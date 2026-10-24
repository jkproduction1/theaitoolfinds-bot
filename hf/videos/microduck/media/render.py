"""Rasterize Microduck's own CAD meshes (MuJoCo model from pollen-robotics/microduck_rl) to transparent PNGs."""
import sys, numpy as np, mujoco
from PIL import Image, ImageDraw
XML = sys.argv[1]; OUT = sys.argv[2]; KEY = sys.argv[3]; VIEWS = sys.argv[4]; SIZE = int(sys.argv[5])
m = mujoco.MjModel.from_xml_path(XML); d = mujoco.MjData(m)
mujoco.mj_resetDataKeyframe(m, d, mujoco.mj_name2id(m, mujoco.mjtObj.mjOBJ_KEY, KEY))
mujoco.mj_forward(m, d)
tris, cols = [], []
for g in range(m.ngeom):
    if m.geom_type[g] != 7 or m.geom_group[g] != 2: continue
    mid = m.geom_dataid[g]
    va, vn = m.mesh_vertadr[mid], m.mesh_vertnum[mid]
    fa, fn = m.mesh_faceadr[mid], m.mesh_facenum[mid]
    V = m.mesh_vert[va:va + vn]; Fc = m.mesh_face[fa:fa + fn]
    W = V @ d.geom_xmat[g].reshape(3, 3).T + d.geom_xpos[g]
    tris.append(W[Fc])
    c = m.mat_rgba[m.geom_matid[g]][:3] if m.geom_matid[g] >= 0 else m.geom_rgba[g][:3]
    cols.append(np.repeat(c[None], len(Fc), 0))
T = np.concatenate(tris); C = np.concatenate(cols)
ctr = T.reshape(-1, 3).mean(0); T = T - ctr
print("tris", len(T), "extent", T.reshape(-1, 3).min(0), T.reshape(-1, 3).max(0))

def rot(yaw, pitch):
    cy, sy, cp, sp = np.cos(yaw), np.sin(yaw), np.cos(pitch), np.sin(pitch)
    Rz = np.array([[cy, -sy, 0], [sy, cy, 0], [0, 0, 1]])
    Rx = np.array([[1, 0, 0], [0, cp, -sp], [0, sp, cp]])
    return Rx @ Rz

def render(name, yaw, pitch=-0.18, size=1000, tilt=0.0):
    S = 2 * size
    R = rot(yaw, pitch)
    # camera: x right, z up, y depth (into screen)
    P = T @ R.T
    if tilt:
        ct, st = np.cos(tilt), np.sin(tilt); Rt = np.array([[ct, 0, -st], [0, 1, 0], [st, 0, ct]]); P = P @ Rt.T
    xs, zs, ys = P[..., 0], P[..., 2], P[..., 1]
    span = max(np.ptp(xs), np.ptp(zs)) * 1.12
    sx = (xs - (xs.max() + xs.min()) / 2) / span * S + S / 2
    sz = S / 2 - (zs - (zs.max() + zs.min()) / 2) / span * S
    n = np.cross(P[:, 1] - P[:, 0], P[:, 2] - P[:, 0]); nl = np.linalg.norm(n, axis=1) + 1e-12; n = n / nl[:, None]
    L = np.array([-0.45, -0.75, 0.5]); L /= np.linalg.norm(L)
    lam = np.abs(n @ L)
    shade = 0.42 + 0.58 * lam
    depth = ys.mean(1)
    order = np.argsort(-depth)  # far first
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0)); dr = ImageDraw.Draw(img)
    for i in order:
        if nl[i] < 1e-12: continue
        c = np.clip(C[i] * shade[i] * 255 * 1.05, 0, 255).astype(int)
        dr.polygon([(sx[i, k], sz[i, k]) for k in range(3)], fill=(c[0], c[1], c[2], 255))
    img = img.resize((size, size), Image.LANCZOS)
    img.save(f"{OUT}/{name}.png"); print("saved", name)

for v in VIEWS.split(","):
    name, yaw = v.split(":")
    render(name, float(yaw), size=SIZE)
