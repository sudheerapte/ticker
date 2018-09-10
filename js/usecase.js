/**
   Use case with main success scenario and optional failure scenarios

   Main success scenario is a sequence node, but each failure scenario
   creates a fork at the departure point, and a recovery method at the
   end. Example:


   Main success scenario:
   1. Do A
   2. Do B
   3. Do C

   Failure scenarios:
   2a. During A or B, if X happens
       Do P
       Fail.
   2b. During A or B, if Y happens:
       Do Q
       Do R
       Resume.

   The above is a use case action containing five primitive actions:
   A, B, C, P, and Q, put together in different possible sequences
   called scenarios. The use case succeeds iff the main success
   scenario (A, B, C) succeeds.

   The main success scenario is the following sequence. First A is
   executed. When A succeeds, B is executed, and when B succeeds, C is
   executed. If any of these three actions fail, then the sequence
   also fails and does not execute any remaining actions.

   In the above example, if the Main success scenario succeeds, then
   the entire use case returns success ("happy path"); otherwise, the
   entire use case action fails.

   But the user has also specified two interesting failure scenarios
   in the use case, denoted by "2a" and "2b".

   In the scenario 2a, at the time while A and B are being executed,
   the condition X happens. In this case, after the currently
   executing step (A or B) is done, you stop continuing with the main
   success sequence and instead do P, and the use case fails.

   In case 2b, some time while A and B are being executed, the
   condition Y happens. In this case, too, you complete the current
   step and then, instead of continuing with the main success
   sequence, you do Q, R, and then resume the main success sequence.

   The conditions "X happens" and "Y happens" are either external
   input signals received (on signal X), or they are conditions on the
   state associated with the use case (predicate X). More on this
   below.

   Primitive actions are of two types:

   "Do" actions:

   "Do" actions take a definite, small time to execute, example: a
   change of state, or the sending of an output signal. These
   actions cannot be interrupted once started; they either succeed -
   or fail.

   "Wait" actions:

   Wait actions sit in wait for external signals or for state
   predicates to succeed.  Wait actions do nothing until the indicated
   signal is received or the predicate becomes true; then they
   succeed.  These actions can take forever, or you can specify a
   timeout in seconds.  If the external signal is received or the
   specified state predicate succeeds, then the action succeeds.

   Wait actions can be interrupted by a failure case. Also, you can
   specify a timeout is hit, the action fails. Similar to a timeout,
   you can specify that these actions should be run during some other
   action. Once this other action succeeds or fails, the Wait action
   also fails.

   For failure cases, which always start with WAIT actions, the WAIT
   actions are run during the steps you specify from the main success
   scenario. If the WAITs do not succeed during these steps, then the
   failure scenarios are never executed, and the WAITs have no effect.

   In the above example, the signal or predicate X is checked only
   during the steps (A, B) as specified.

   The way we write the above use case is:

   The words "Main", "F1", and "F2" are names that you specify.

   Fail and Resume are keywords. A third keyword is Success, which
   simply makes the entire use case succeed.

*/

"use strict";
