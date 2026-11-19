---------------------------- MODULE EvidenceStatus ----------------------------
EXTENDS TLC
VARIABLES signed, trusted, anchored, sourceOK, label
vars == <<signed, trusted, anchored, sourceOK, label>>
Labels == {"unverified", "signed", "trusted-key", "timestamped", "source-verified"}
Init == /\ signed = FALSE /\ trusted = FALSE /\ anchored = FALSE
        /\ sourceOK = FALSE /\ label = "unverified"
Observe == /\ signed' \in {signed, TRUE}
           /\ trusted' \in {trusted, TRUE}
           /\ anchored' \in {anchored, TRUE}
           /\ sourceOK' \in {sourceOK, TRUE}
           /\ UNCHANGED label
Publish == /\ label' \in Labels
           /\ (label' = "signed" => signed)
           /\ (label' = "trusted-key" => signed /\ trusted)
           /\ (label' = "timestamped" => anchored)
           /\ (label' = "source-verified" => sourceOK)
           /\ UNCHANGED <<signed, trusted, anchored, sourceOK>>
Next == Observe \/ Publish
Spec == Init /\ [][Next]_vars
TypeOK == /\ signed \in BOOLEAN /\ trusted \in BOOLEAN
          /\ anchored \in BOOLEAN /\ sourceOK \in BOOLEAN /\ label \in Labels
NoFalseSourceLabel == label = "source-verified" => sourceOK
NoFalseTimestampLabel == label = "timestamped" => anchored
NoFalseTrustedLabel == label = "trusted-key" => signed /\ trusted
=============================================================================
