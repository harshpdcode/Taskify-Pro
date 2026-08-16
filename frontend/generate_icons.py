import os
from PIL import Image, ImageDraw

def create_superhero_icon(size, is_maskable=False):
    # Create image with RGBA
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0) if not is_maskable else (15, 17, 26, 255))
    draw = ImageDraw.Draw(img)
    
    scale = size / 512.0
    
    # Coordinates scaling
    def s(val):
        return int(val * scale)
    
    center_offset = s(30) if not is_maskable else s(60)
    badge_size = s(450) if not is_maskable else s(390)
    rx = s(110) if not is_maskable else s(95)
    
    x0, y0 = (size - badge_size) // 2, (size - badge_size) // 2
    x1, y1 = x0 + badge_size, y0 + badge_size
    
    # 1. 3D Comic Drop Shadow (Pure Black)
    shadow_offset = s(20)
    draw.rounded_rectangle(
        [x0 + shadow_offset, y0 + shadow_offset, x1 + shadow_offset, y1 + shadow_offset],
        radius=rx,
        fill=(0, 0, 0, 255)
    )
    
    # 2. Main Badge with Comic Gradient (Yellow to Hot Pink)
    # We draw gradient across the badge
    badge_mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(badge_mask)
    mask_draw.rounded_rectangle([x0, y0, x1, y1], radius=rx, fill=255)
    
    gradient = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(gradient)
    
    for y in range(y0, y1):
        progress = (y - y0) / max(1, (y1 - y0))
        # Color from #ffe600 (255, 230, 0) to #ff007a (255, 0, 122)
        r = int(255)
        g = int(230 * (1 - progress))
        b = int(122 * progress)
        g_draw.line([(x0, y), (x1, y)], fill=(r, g, b, 255))
        
    img.paste(gradient, (0, 0), badge_mask)
    
    # 3. Outer Black Border
    draw.rounded_rectangle([x0, y0, x1, y1], radius=rx, outline=(0, 0, 0, 255), width=s(16))
    
    # 4. White Highlight arc at top
    highlight_margin = s(40)
    draw.arc(
        [x0 + highlight_margin, y0 + highlight_margin // 2, x1 - highlight_margin, y0 + s(140)],
        start=190, end=350,
        fill=(255, 255, 255, 200),
        width=s(12)
    )
    
    # 5. Lightning Bolt geometry centered
    # Standard points for 512x512:
    base_points = [
        (280, 75),   # top tip
        (130, 260),  # left middle
        (220, 260),  # inner left
        (175, 435),  # bottom tip
        (370, 220),  # right middle
        (265, 220),  # inner right
        (320, 75)    # top right
    ]
    
    # Scale points
    def scale_poly(pts, dx=0, dy=0):
        cx, cy = 256, 256
        res = []
        for px, py in pts:
            # Center and scale
            nx = int((px - cx) * (scale * 0.95) + size // 2 + dx)
            ny = int((py - cy) * (scale * 0.95) + size // 2 + dy)
            res.append((nx, ny))
        return res
    
    # Glitch cyan underlay
    cyan_pts = scale_poly(base_points, dx=s(12), dy=s(10))
    draw.polygon(cyan_pts, fill=(0, 240, 255, 240))
    
    # Solid black lightning silhouette
    black_pts = scale_poly(base_points, dx=0, dy=0)
    draw.polygon(black_pts, fill=(0, 0, 0, 255))
    
    # Inner glowing yellow core
    inner_base_points = [
        (275, 105),
        (165, 250),
        (235, 250),
        (205, 385),
        (335, 230),
        (260, 230),
        (295, 105)
    ]
    inner_pts = scale_poly(inner_base_points, dx=0, dy=0)
    draw.polygon(inner_pts, fill=(255, 230, 0, 255))
    
    # White Comic Sparkles
    sp1_x, sp1_y = int(size * 0.72), int(size * 0.28)
    r1 = s(16)
    draw.ellipse([sp1_x - r1, sp1_y - r1, sp1_x + r1, sp1_y + r1], fill=(255, 255, 255, 255), outline=(0, 0, 0, 255), width=s(4))
    
    sp2_x, sp2_y = int(size * 0.28), int(size * 0.74)
    r2 = s(10)
    draw.ellipse([sp2_x - r2, sp2_y - r2, sp2_x + r2, sp2_y + r2], fill=(255, 255, 255, 255), outline=(0, 0, 0, 255), width=s(3))
    
    return img

target_dir = r"c:\Users\harsh\OneDrive\Desktop\all projets\Projects\Task_manager_project\frontend\public"

# Generate 192, 512, and 512 maskable
icon192 = create_superhero_icon(192)
icon192.save(os.path.join(target_dir, "icon-192.png"), "PNG")
print("Saved icon-192.png")

icon512 = create_superhero_icon(512)
icon512.save(os.path.join(target_dir, "icon-512.png"), "PNG")
print("Saved icon-512.png")

icon512_maskable = create_superhero_icon(512, is_maskable=True)
icon512_maskable.save(os.path.join(target_dir, "icon-512-maskable.png"), "PNG")
print("Saved icon-512-maskable.png")
