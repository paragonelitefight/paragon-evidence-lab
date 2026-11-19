// Source-only predicate; no independently authenticated shipment input.
// Proves only that the supplied hidden hours meet the public limit.
fn main(transit_hours: u32, limit_hours: pub u32) {
    assert(limit_hours > 0);
    assert(limit_hours <= 8760);
    assert(transit_hours <= limit_hours);
}
