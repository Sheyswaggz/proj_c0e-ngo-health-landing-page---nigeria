# NGO Health Landing Page - Nigeria

A modern, responsive landing page for a Nigerian health-focused NGO, built with HTML, CSS, and JavaScript. Features a clean design optimized for performance and accessibility.

## Features

- Responsive design that works on all devices
- Optimized images and assets for fast loading
- Accessible HTML structure
- Modern CSS with flexbox and grid layouts
- Vanilla JavaScript for interactive elements
- Docker support for easy deployment
- Kubernetes manifests for production deployment
- Automated CI/CD pipeline with GitHub Actions

### Hero Section

The hero section is the first visual element visitors encounter, designed to immediately communicate the NGO's mission and inspire action.

#### Purpose and Design

- **Full-width responsive layout**: Adapts seamlessly across mobile, tablet, and desktop devices
- **Mission-focused messaging**: Clear, compelling headline and subtitle that communicate the NGO's purpose
- **Dual call-to-action buttons**: Prominent "Donate Now" and "Become a Volunteer" buttons for immediate engagement
- **Culturally appropriate imagery**: Background features Nigerian health workers and communities
- **Optimized for low-bandwidth**: Images compressed and formatted for Nigerian internet conditions

#### Image Requirements

**Background Image Specifications:**
- **Dimensions**: 
  - Desktop: 1920x1080px (minimum)
  - Tablet: 1024x768px
  - Mobile: 768x1024px (portrait)
- **Format**: WebP with JPEG fallback
- **File Size**: 
  - WebP: < 150KB (target), < 200KB (maximum)
  - JPEG: < 250KB (maximum)
- **Aspect Ratio**: 16:9 for desktop, 4:3 for tablet, 3:4 for mobile
- **Content**: Should feature Nigerian health workers, communities, or healthcare settings
- **Color Palette**: Should complement Nigerian green (#008751) theme

#### Replacing Placeholder Images

To replace the placeholder hero images with actual NGO images:

1. **Prepare your images**:
   - Optimize images using the guidelines in the "Image Optimization" section below
   - Create both WebP and JPEG versions
   - Name files: `hero-bg.webp` and `hero-bg.jpg`

2. **Replace files**:
   - Place optimized images in `assets/images/` directory
   - Ensure filenames match exactly: `hero-bg.webp` and `hero-bg.jpg`
   - The hero section will automatically use WebP with JPEG fallback

### About Section

The About section tells the organization's story and establishes credibility through compelling narrative, impact statistics, and core values.

#### Purpose and Structure

- **Organization Story**: Communicates the NGO's founding, journey, and commitment to healthcare equity
- **Mission & Vision**: Clearly articulates the organization's purpose and aspirations
- **Impact Statistics**: Displays quantifiable achievements with animated counters
- **Core Values**: Presents organizational principles with icons and descriptions
- **Team Image**: Features authentic photos of team members and community work

#### Content Customization

**Updating Organization History and Mission/Vision:**

1. **Edit Story Content** (`index.html` lines 150-165):