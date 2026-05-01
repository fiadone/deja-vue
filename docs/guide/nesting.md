# Nesting Animations

Déjà Vue supports nesting animations to create complex hierarchical animation structures. Child animations automatically become part of their parent timeline and can be positioned relative to it.

## How Nesting Works

When you place animation components inside other animation components:
- The parent `Timeline` provides its animation instance via Vue's provide/inject
- Child animations automatically inject the parent
- Child animations are added to the parent timeline on mount
- Positioning is relative to the parent timeline

## Automatic Nesting

The simplest way to nest animations is to place them inside a Timeline:

```vue
<template>
  <Timeline>
    <Tween method="to" :vars="{ x: 100, duration: 1 }">
      <div>Animation 1</div>
    </Tween>
    <Tween
      method="to"
      position="+=0.5"
      :vars="{ y: 100, duration: 1 }"
    >
      <div>Animation 2 (starts 0.5s after animation 1)</div>
    </Tween>
  </Timeline>
</template>

<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>
```

## Timeline Inside Timeline

Nest entire timelines for complex structures:

```vue
<template>
  <Timeline>
    <Tween method="to" :vars="{ x: 100, duration: 1 }">
      <div>Parent Animation</div>
    </Tween>
    
    <Timeline position="+=0.5">
      <Tween method="to" :vars="{ y: 50, duration: 0.5 }">
        <div>Child Animation 1</div>
      </Tween>
      <Tween
        method="to"
        position="<"
        :vars="{ rotation: 90, duration: 0.5 }"
      >
        <div>Child Animation 2</div>
      </Tween>
    </Timeline>
  </Timeline>
</template>

<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>
```

## Position Markers and Callbacks

Use `PositionMarker` and `Callback` components for more control over animation sequences:

```vue
<template>
  <Timeline>
    <PositionMarker label="intro" />
    <Tween method="from" :vars="{ opacity: 0, duration: 1 }">
      <div>Fade in</div>
    </Tween>
    
    <PositionMarker label="main" />
    <Tween method="to" :vars="{ x: 200, duration: 2 }">
      <div>Move right</div>
    </Tween>
    
    <Callback :fn="onMain" position="main" />
    
    <PositionMarker label="outro" />
    <Tween
      method="to"
      position="+=0.5"
      :vars="{ opacity: 0, duration: 1 }"
    >
      <div>Fade out</div>
    </Tween>
  </Timeline>
</template>

<script setup>
import { Timeline, Tween, PositionMarker, Callback } from 'deja-vue'

const onMain = (timeline) => {
  console.log('Main section reached at', timeline.progress() * 100 + '%')
}
</script>
```

## Manual Parent Assignment

Override automatic nesting by explicitly setting the `parent` prop:

```vue
<template>
  <div>
    <Timeline ref="mainTimeline">
      <Tween method="to" :vars="{ x: 100, duration: 1 }">
        <div>Main timeline</div>
      </Tween>
    </Timeline>
    
    <!-- This animation is manually attached to mainTimeline -->
    <Tween 
      method="to" 
      position="+=0.5"
      :parent="mainTimeline?.animation" 
      :vars="{ y: 100, duration: 1 }" 
    >
      <div>Manually nested animation</div>
    </Tween>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Timeline, Tween } from 'deja-vue'

const mainTimeline = ref()
</script>
```

This is useful when you want to:
- Nest animations from different parts of your component tree
- Control nesting programmatically
- Prevent automatic nesting

## Preventing Automatic Nesting

Set `parent` to `null` to prevent automatic nesting:

```vue
<template>
  <Timeline>
    <Tween method="to" :vars="{ x: 100, duration: 1 }">
      <div>Timeline animation</div>
    </Tween>
    
    <!-- This animation is independent, not nested -->
    <Tween
      method="to"
      :parent="null"
      :vars="{ y: 100, duration: 1 }"
    >
      <div>Standalone animation</div>
    </Tween>
  </Timeline>
</template>

<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>
```

## Positioning in Nested Timelines

GSAP's position syntax applies relative to the parent timeline:

```vue
<template>
  <Timeline>
    <!-- Relative positioning -->
    <Tween method="to" :vars="{ x: 100, duration: 1 }">
      <div>Animation 1</div>
    </Tween>
    
    <!-- Start 0.5s after animation 1 ends -->
    <Tween
      method="to"
      position="+=0.5"
      :vars="{ y: 100, duration: 1 }"
    >
      <div>Animation 2</div>
    </Tween>
    
    <!-- Start 0.2s before animation 2 ends (overlap) -->
    <Tween
      method="to"
      position="-=0.2"
      :vars="{ rotation: 180, duration: 1 }"
    >
      <div>Animation 3</div>
    </Tween>
    
    <!-- Start at specific label -->
    <PositionMarker label="middle" />
    <Tween
      method="to"
      position="middle"
      :vars="{ scale: 1.5, duration: 1 }"
    >
      <div>At middle</div>
    </Tween>
  </Timeline>
</template>

<script setup>
import { Timeline, Tween, PositionMarker } from 'deja-vue'
</script>
```

## Complex Hierarchies

Create deeply nested structures:

```vue
<template>
  <Timeline @complete="onComplete">
    <PositionMarker label="level1-start" />
    
    <!-- Level 1: Direct children -->
    <Tween method="from" :vars="{ opacity: 0, duration: 0.5 }">
      <div>Level 1 - Item 1</div>
    </Tween>
    
    <!-- Level 2: Nested timeline -->
    <Timeline position="+=0.2">
      <PositionMarker label="level2-start" />
      
      <!-- Level 2 children -->
      <Tween method="to" :vars="{ x: 50, duration: 0.5 }">
        <div>Level 2 - Item 1</div>
      </Tween>
      <Tween
        method="to"
        position="<"
        :vars="{ y: 50, duration: 0.5 }"
      >
        <div>Level 2 - Item 2</div>
      </Tween>
      
      <!-- Level 3: Even deeper nesting -->
      <Timeline position="+=0.2">
        <Tween method="to" :vars="{ rotation: 360, duration: 1 }">
          <div>Level 3 - Item 1</div>
        </Tween>
      </Timeline>
    </Timeline>
    
    <PositionMarker label="level1-end" />
  </Timeline>
</template>

<script setup>
import { Timeline, Tween, PositionMarker } from 'deja-vue'

const onComplete = (timeline) => {
  console.log('All animations complete!')
}
</script>
```

## Performance Considerations

While nesting works at any depth, consider these tips:

1. **Reasonable Nesting Depth**: Avoid excessively deep nesting (5+ levels)
2. **Large Groups**: For many animations, consider flattening the structure
3. **Manual Parent**: Use manual `parent` assignment for better control in complex structures
4. **Component Structure**: Align component structure with animation hierarchy when possible

## Common Patterns

### Sequential Animations

```vue
<Timeline>
  <Tween method="to" :vars="{ opacity: 1, duration: 0.5 }" />
  <Tween method="to" :vars="{ x: 100, duration: 1 }" />
  <Tween method="to" :vars="{ y: 100, duration: 1 }" />
</Timeline>
```

### Grouped Animations

```vue
<Timeline>
  <Tween
    group
    method="to"
    :vars="{ opacity: 0.5, duration: 1 }"
  >
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </Tween>
</Timeline>
```

### Parallel Animations

```vue
<Timeline>
  <PositionMarker label="parallel" />
  <Tween
    method="to"
    position="parallel"
    :vars="{ x: 100, duration: 1 }"
  />
  <Tween
    method="to"
    position="parallel"
    :vars="{ y: 100, duration: 1 }"
  />
  <Tween
    method="to"
    position="parallel"
    :vars="{ rotation: 360, duration: 1 }"
  />
</Timeline>
```

### Staggered Animations

```vue
<template>
  <Timeline>
    <Tween 
      group
      method="from" 
      :vars="{ opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }" 
    >
      <div v-for="item in items" :key="item">{{ item }}</div>
    </Tween>
  </Timeline>
</template>

<script setup>
import { Timeline, Tween } from 'deja-vue'

const items = ['A', 'B', 'C', 'D']
</script>
```