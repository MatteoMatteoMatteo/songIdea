import { trigger, transition, style, query, animate } from "@angular/animations";

export const fader = trigger("routeAnimations", [
  transition("* <=> *", [
    query(
      ":enter, :leave",
      [
        style({
          position: "absolute",
          opacity: "0",
          left: 0,
          width: "100%",
          transform: "scale(0) translateY(100%)",
        }),
      ],
      { optional: true }
    ),
    query(
      ":enter",
      [animate("600ms ease", style({ opacity: 1, transform: "scale(1) translateY(0)" }))],
      { optional: true }
    ),
  ]),
]);

export const nicer = trigger("routeAnimations", [
  transition("* <=> *", [
    query(
      ":enter, :leave",
      [
        style({
          position: "absolute",
          opacity: "0",
          left: 0,
          width: "100%",
          transform: "translateY(40%)",
        }),
      ],
      { optional: true }
    ),
    query(":enter", [animate("600ms ease", style({ opacity: 1, transform: "translateY(0)" }))], {
      optional: true,
    }),
  ]),
]);
