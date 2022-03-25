Block:

- could probably inherit from Box and avoid extra Surface objects when stable enough

Theme:

- Padding and margin overlap between geometry and appearance. Need to combine them so one can override the other.

Interactivity:

- Use getLocalPosition

```
sprite.on('mousedown', e => {
  console.log(e.data.getLocalPosition(sprite));
});
```
