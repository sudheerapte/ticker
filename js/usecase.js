/**
   Use case with main success scenario and optional failure scenarios

   BACKGROUND:

   An action is something that executes for a period of time and then
   either succeeds or fails. We say that the action "starts"
   executing, then it executes for some period, and finally it
   "finishes", either succeeding or failing.

   Primitive actions are of two types:

   "Do" actions:

   "Do" actions take a definite, small time to execute. Typically, the
   action is either a change of state (say, the program goes into a
   different state where it is expecting the user to type a key), or
   the sending of an output signal (say, an LED light is commanded to
   turn green). These actions cannot be interrupted once started; they
   either succeed or fail quickly and on their own time.

   "Wait" actions:

   Wait actions sit in wait for some specified criteria to be
   satisfied.  Criteria can be either receiving external signals (for
   example, "wait for the phone to ring"), or state predicates (for
   example, "wait for the program to go into a state where the user is
   expected to type a key").  Wait actions do nothing until their
   criteria are sastified; then they succeed.

   Wait actions can take forever, or you can have them fail based on
   two time-based criteria, which are explained below.


   Sequence actions:

   A sequence action is a complex action containing a list of
   primitive actions A, B, C, D, ... N.

   This sequence behaves as follows: first, it executes A, then if
   that succeeds, it executes B, and so on, until the last action in
   the list succeeds; then the sequence succeeds. If any of the
   primitive actions fails, then the whole sequence immediately fails
   without executing any of the remaining actions.

   Note that if any of these primitive actions is a "Wait" action,
   then the sequence will remain waiting at that point until the Wait
   action either succeeds or fails; then it will continue executing
   the subsequent actions.

   The important thing is that a sequence action will be executing
   exactly one action at any given time, until it either succeeds or
   fails. The sequence action succeeds only if all the component
   actions succeed.


   Time-bound Wait criteria:

   If you do not specify any time bounds, a Wait action runs forever
   until its external signal or state predicate succeeds. But you can
   additionally specify time-bound criteria in two ways:

   First, you can specify a timeout period in seconds.  If the
   external signal is received, or the specified state predicate
   succeeds, within that time, then the Wait action succeeds;
   otherwise, the Wait action fails.

   Second, you can specify that a Wait action should run only during
   the execution of some other action or sequence.  The Wait action
   begins executing as soon as this other action or sequence starts
   executing.  Once this other action or sequence succeeds or fails,
   the Wait action also fails. If the Wait action's external signal or
   specified state predicate succeeds before this time, then the Wait
   action immediately succeeds.

   Note: This machanism, called the "During" mechanism, can be used to
   simultaneously start two Wait actions W1 and W2, which might be
   waiting for two different things to happen. If you directly execute
   W1, and specify W2 to run "during" W1, then both actions will begin
   executing simultaneously. Whichever of them first succeeds will
   finish executing first. If W1 finishes (either succeeding or
   failing), then W2 will immediately fail. If W2 succeeds, then W1
   will continue to execute until its criteria are satisfied.


   Use cases:

   A use case is a realistic action that can execute one of multiple
   possible sequences of actions, depending on the circumstances. The
   most normal, expected sequence of actions is called the "Main
   success scenario", while the less common sequences are called
   "Alternate scenarios".

   Main success scenario:
       Do A.
       Do B.
       Do C.

   Fail2a:
       Wait for X During A, B.
       Do P.
       Fail.
   Alt2b:
       Wait for Y During A, B.
       Do Q.
       Do R.
       Resume.

   The above is a use case action containing five primitive actions:
   A, B, C, P, and Q, put together in different possible sequences
   called scenarios. The use case succeeds iff the main success
   scenario (A, B, C) succeeds.

   In the above example, if the Main success scenario succeeds, then
   the entire use case returns success ("happy path"); otherwise, the
   entire use case action fails.

   But the user has also specified two interesting failure scenarios
   in the use case, denoted by "Fail2a" and "Alt2b".

   In the scenario Fail2a, at the time while A and B in the Main
   success scernario are being executed, the condition X happens. In
   this case, after the currently executing step (A or B) is done, you
   stop continuing with the main success sequence and instead do P,
   and the use case fails.

   In scernario Alt2b, some time while A and B are being executed, the
   condition Y happens. In this case, too, you complete the current
   step and then, instead of continuing with the main success
   sequence, you do Q, R, and then resume the main success sequence
   where you left off. That is, if condition Y happens during A, then
   you run the sequence A, Q, R, B, C. If condition Y happens during
   B, then you run the sequence A, B, Q, R, C.

   The conditions "X happens" and "Y happens" are either external
   input signals received (on signal X), or they are conditions on the
   state associated with the use case (predicate X). More on this
   below.

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
