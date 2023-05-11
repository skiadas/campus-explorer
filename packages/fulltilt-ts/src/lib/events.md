# Orientation and Motion events

This is a summary of the different events that the system must consider.

A general reference for [orientation and motion data](https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events/Orientation_and_motion_data_explained)

Orientation events:

- [`deviceorientation`](https://developer.mozilla.org/en-US/docs/Web/API/Window/deviceorientation_event) on the `window` object. Not supported on Desktop Safari. It contains properties `absolute`, `alpha`, `beta`, `gamma`, and possibly `webkitCompassHeading` and `webkitCompassAccuracy`.
- `orientationchange` on the `window` object. This is actually deprecated. It was only ever present on mobile devices it seems. We use it as a fallback.
- [`change`](https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation) on the `window.screen.orientation` object. Part of the [Screen Orientation API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Orientation_API)

In general, the system works by taking the `deviceorientation` event into account, as well as one of the other two depending on device capabilities, preferring the Screen Orientation API functionality.

The `window.screen.orientation` property contains values for `angle` and `type`.

[The official Specification for device orientation](https://w3c.github.io/deviceorientation/#deviceorientation).
