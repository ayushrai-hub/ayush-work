# Three.js Integration Architecture

This document provides comprehensive architecture documentation for Three.js integrations in the portfolio application, focusing on the complex 3D components and their implementation patterns.

## Overview

The portfolio incorporates Three.js through React Three Fiber (@react-three/fiber) to create interactive 3D hero sections with geometric shapes, animations, and particle systems. The implementation prioritizes performance, accessibility, and graceful degradation.

## Architecture Components

### Core Dependencies

```json
{
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.88.0",
  "three": "^0.157.0",
  "framer-motion": "^10.16.0"
}
```

### Component Hierarchy

```
ThreeJSHero (Main Container)
├── Canvas (React Three Fiber)
│   ├── Lighting (ambient + directional + point)
│   ├── PresentationControls (User interaction)
│   ├── CameraRig (Mouse-driven camera movement)
│   ├── FloatingShapes (Geometric primitives)
│   │   ├── Float components with Sphere/Octahedron/Box
│   │   └── MeshDistortMaterial with dynamic properties
│   └── Suspense (Loading states)
```

## Implementation Details

### Canvas Configuration

#### Base Setup

```tsx
<Canvas
  camera={{
    position: [0, 0, 5],
    fov: 75,
    near: 0.1,
    far: 1000,
  }}
  gl={{
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  }}
>
  {/* Scene content */}
</Canvas>
```

**Performance Optimizations:**
- `antialias: true` for smooth edges
- `alpha: true` for transparent backgrounds
- `powerPreference: "high-performance"` for GPU acceleration
- `near/far` clipping planes optimized for scene bounds

### Lighting System

```tsx
<ambientLight intensity={0.4} />
<directionalLight position={[10, 10, 5]} intensity={1} />
<pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
```

**Lighting Strategy:**
- **Ambient Light**: Base illumination (40% intensity)
- **Directional Light**: Key light from top-right
- **Point Light**: Accent lighting with blue tint

### Interactive Controls

#### Presentation Controls

```tsx
<PresentationControls
  global
  config={{ mass: 2, tension: 500 }}
  snap={{ mass: 4, tension: 1500 }}
  rotation={[0, 0.3, 0]}
  polar={[-Math.PI / 3, Math.PI / 3]}
  azimuth={[-Math.PI / 1.4, Math.PI / 2]}
>
  {/* Interactive content */}
</PresentationControls>
```

**Control Parameters:**
- `mass: 2, tension: 500` - Smooth, responsive movement
- `rotation: [0, 0.3, 0]` - Subtle initial Y-rotation
- `polar/azimuth` - Constrained rotation limits

#### Camera Rig

```tsx
function CameraRig() {
  const { camera, mouse } = useThree();

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      mouse.x * 0.5,
      0.05
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      mouse.y * 0.5,
      0.05
    );
    camera.lookAt(0, 0, 0);
  });

  return null;
}
```

**Mouse Interaction:**
- Smooth lerp interpolation for natural movement
- `0.5` multiplier for sensitivity
- `0.05` lerp factor for smoothness

### Geometric Primitives

#### Floating Shapes Component

```tsx
<Float speed={1.4} rotationIntensity={2} floatIntensity={0.5}>
  <Sphere position={[-1, 0, 0]} args={[0.8, 32, 32]}>
    <MeshDistortMaterial
      color="#6366f1"
      distort={0.3}
      speed={2}
      roughness={0}
    />
  </Sphere>
</Float>
```

**Shape Collection:**
- **Primary Sphere**: Large, blue, highly distorted
- **Secondary Octahedron**: Purple, medium distortion
- **Tertiary Box**: Orange, low distortion
- **Accent Spheres**: Small, various colors

#### Material Properties

Each shape uses `MeshDistortMaterial` with varying parameters:

- `distort`: Amount of mesh deformation (0.1-0.3)
- `speed`: Animation speed (1.2-3.0)
- `roughness`: Surface reflection (0-0.2)

### Animation System

#### Float Component

Provided by @react-three/drei, handles automatic floating animations:

```tsx
<Float
  speed={1.4}          // Animation speed
  rotationIntensity={2} // Rotation amplitude
  floatIntensity={0.5}  // Floating amplitude
>
```

#### useFrame Hook

Used in `FloatingShapes` for continuous rotation:

```tsx
useFrame((state) => {
  if (groupRef.current) {
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  }
});
```

### Performance Optimizations

#### WebGL Detection

```tsx
const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
};
```

**Graceful Degradation:**
- Detect WebGL support on component mount
- Conditionally render Canvas only where WebGL is available
- Fallback to static content on low-end devices

#### Mobile Performance

```tsx
{webGLAvailable && (
  <div className="absolute inset-0 hidden md:block">
    <ThreeJSContent />
  </div>
)}
```

**Mobile Strategy:**
- Disable 3D on mobile/tablet viewports (`hidden md:block`)
- Prevent battery drain on mobile devices
- Maintain performance for desktop users

#### React Suspension

```tsx
<Suspense fallback={null}>
  <FloatingShapes />
</Suspense>
```

**Loading Strategy:**
- `fallback={null}` for seamless loading
- No loading spinners to maintain design purity

### Error Handling

#### Error Boundary Integration

```tsx
<ErrorBoundary>
  <Canvas>
    {/* 3D Content */}
  </Canvas>
</ErrorBoundary>
```

**Error Recovery:**
- Isolate Three.js failures
- Prevent page crashes
- Graceful fallback to 2D content

### Accessibility Considerations

#### Motion Preferences

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')?.matches;

if (!prefersReducedMotion) {
  // Enable animations
}
```

**Accessibility Features:**
- Respect `prefers-reduced-motion` settings
- Keyboard navigation preserved (3D is decorative)
- Screen reader compatibility

#### Semantic Structure

3D content is decorative; screen readers ignore it via:
- No ARIA labels needed
- Content announced through regular HTML text
- Canvas has appropriate role attributes

### Testing Strategy

#### Component Testing

```tsx
// Test WebGL availability detection
it('detects WebGL support', () => {
  const isAvailable = isWebGLAvailable();
  expect(typeof isAvailable).toBe('boolean');
});

// Test conditional rendering
it('renders fallback when WebGL unavailable', () => {
  // Mock WebGL unavailable
  render(<ThreeJSHero />);
  expect(screen.queryByTestId('canvas')).not.toBeInTheDocument();
});
```

#### Integration Testing

```tsx
it('handles error boundary failures', () => {
  // Test error boundary with Three.js failures
});

it('respects motion preferences', () => {
  // Mock prefers-reduced-motion
});
```

### Development Environment

#### Hot Reload Support

Three.js components work with Vite's HMR:
- State preserved during development
- Canvas re-renders on file changes
- Performance debugging with React DevTools

#### DevTools Integration

```tsx
// Enable React DevTools for Three.js debugging
import { extend } from '@react-three/fiber';
extend({ OrbitControls }); // Add to dev only
```

### Performance Monitoring

#### Memory Usage

Monitor for memory leaks:
- Canvas disposal on unmount
- Geometry/material cleanup
- Event listener removal

#### Frame Rate

Maintain 60fps target:
- Use Chrome DevTools Performance tab
- Monitor GPU usage
- Profile rendering bottlenecks

### Deployment Considerations

#### Build Optimization

Vite automatically:
- Code splits Three.js chunks
- Tree shakes unused THREE features
- Minifies GLSL shaders

#### CDN Delivery

Three.js served via CDN in production:
- Reduced bundle size
- Cached across deployments
- Faster load times

### Future Extensions

#### Planned Features

- **Particle Systems**: Interactive particle backgrounds
- **Custom Shaders**: GLSL shader effects
- **Model Loading**: GLTF 3D model support
- **VR/AR Support**: WebXR integration
- **Performance Monitoring**: Real-time FPS tracking

#### Architecture Scalability

- Modular shape components
- Configurable material system
- Plugin-based effect system
- Scene graph management

### Troubleshooting

#### Common Issues

**WebGL Context Loss:**
- Implement context restoration
- Handle tab switching gracefully
- Auto-restart on context recovery

**Performance Degradation:**
- Reduce geometry complexity
- Implement LOD (Level of Detail)
- Use instanced rendering for multiple objects

**Browser Compatibility:**
- Test across target browsers
- Provide fallbacks for unsupported features
- Monitor browser-specific issues

### Resources

#### Documentation Links

- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [React Three Drei](https://github.com/pmndrs/drei)
- [Three.js Manual](https://threejs.org/manual/)
- [WebGL Fundamentals](https://webglfundamentals.org/)

#### Community Resources

- [THREE.js Examples](https://threejs.org/examples/)
- [React Three Fiber Discord](https://discord.gg/ZZjjNvJ)
- [Three.js Forum](https://discourse.threejs.org/)

---

## Implementation Guidelines

### When to Use Three.js

- Hero sections requiring visual impact
- Data visualizations
- Interactive product demos
- Brand storytelling experiences

### When to Avoid

- Content-critical interfaces
- Mobile-first applications
- SEO-critical pages
- Accessibility-first experiences

### Best Practices

1. **Always test WebGL availability**
2. **Implement error boundaries**
3. **Consider mobile performance**
4. **Respect user motion preferences**
5. **Monitor performance metrics**
6. **Provide meaningful fallbacks**
7. **Test across target browsers**
8. **Document component APIs**
9. **Maintain 60fps target**
10. **Clean up resources properly**

This architecture provides a robust foundation for Three.js integrations while prioritizing performance, accessibility, and maintainability.
