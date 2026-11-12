import { test, expect } from "bun:test";
import { parseIntent, matchSpots } from "./matchSpots";
import { SPOTS } from "../../data/nashvilleSpots";

test("dad dinner Sunday East Nashville quiet with parking picks an open-Sunday East Nashville spot", () => {
  const intent = parseIntent("Dinner with my dad on Sunday in East Nashville, quiet, reservation, good parking");
  expect(intent.neighborhood).toBe("East Nashville");
  expect(intent.sunday && intent.quiet && intent.parking && intent.reservation).toBe(true);
  const top = matchSpots(SPOTS, intent)[0].spot;
  expect(top.neighborhood).toBe("East Nashville");
  expect(top.openSunday).toBe(true);
});

test("asking for reservations never ranks a walk-in-only spot first", () => {
  const top = matchSpots(SPOTS, parseIntent("hot chicken in Midtown, need a reservation"))[0].spot;
  expect(top.reservations).toBe(true);
});
