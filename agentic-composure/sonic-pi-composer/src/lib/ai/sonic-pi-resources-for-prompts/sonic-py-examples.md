Skip to content
 
Search Gists
Search...
All gists
Back to GitHub
@darinwilson
darinwilson/sonic_pi_examples.txt
Last active 2 months ago • Report abuse
Code
Revisions
3
Stars
64
Forks
14
Clone this repository at &lt;script src=&quot;https://gist.github.com/darinwilson/137764d4b06072de626c.js&quot;&gt;&lt;/script&gt;
<script src="https://gist.github.com/darinwilson/137764d4b06072de626c.js"></script>
Sonic Pi Examples
sonic_pi_examples.txt
##############################################
## Example 1 - play a note
play 60


##############################################
## Example 2 - play 4 random notes
4.times do
  play rrand_i(60, 90)
  sleep 0.5
end


##############################################
## Example 3 - play a major chord
play chord(60, :m7)


##############################################
## Example 4 - play an arpeggio
loop do
  play chord(60, :m7).tick
  sleep 0.5
end


##############################################
## Example 5 - play a chord with an arpeggio
loop do
  play chord(60, :m7), release: 3
  16.times do
    play chord(60, :m7).choose
    sleep 0.25
  end
end


##############################################
## Example 6 - play a shifting chord with an arpeggio
start_notes = ring(60, 62, 63, 62)
loop do
  my_chord = chord(start_notes.tick, :m7)
  play my_chord, release: 2
  16.times do
    play my_chord.choose
    sleep 0.125
  end
end


##############################################
## Example 7 - play a sample
sample :drum_bass_hard


##############################################
## Example 8 - play a simple drum beat
loop do
  sample :bd_haus
  sleep 0.5
end


##############################################
## Example 9 - alternate kick and snare
loop do
  if tick.even?
    sample :bd_haus
  else
    sample :sn_dolf
  end
  sleep 0.5
end


##############################################
## Example 10 - combine kick, snare and hi-hat
loop do
  sample :drum_cymbal_closed
  if tick.even?
    sample :bd_haus
  else
    sample :sn_dolf
  end
  sleep 0.25
  sample :drum_cymbal_closed
  sleep 0.25
end


##############################################
## Example 11 - play a drum loop once
sample :loop_amen


##############################################
## Example 12 - play a drum loop as a loop
loop do
  sample :loop_amen
  sleep sample_duration(:loop_amen)
end


##############################################
## Example 13 - try to combine melody, harmony, rhythm (doesn't work)
loop do
  start_note = ring(60, 62, 63, 62).tick
  my_chord = chord(start_note, :m7)
  play my_chord, release: 2
  16.times do
    play my_chord.choose, release: 0.25, amp: [0.75, 0.5, 0.25].choose
    sleep 0.125
  end
end

loop do
  sample :loop_amen
  sleep sample_duration(:loop_amen)
end


##############################################
## Example 14 - a fix for Example 13, using threads (drums out of sync)
in_thread do
  loop do
    start_note = ring(60, 62, 63, 62).tick
    my_chord = chord(start_note, :m7)
    play my_chord, release: 2
    16.times do
      play my_chord.choose, release: 0.25, amp: [0.75, 0.5, 0.25].choose
      sleep 0.125
    end
  end
end

loop do
  sample :loop_amen
  sleep sample_duration(:loop_amen)
end


##############################################
## Example 15 - a fix for Example 14, drums now in sync
in_thread do
  loop do
    start_note = ring(60, 62, 63, 62).tick
    my_chord = chord(start_note, :m7)
    play my_chord, release: 2
    16.times do
      play my_chord.choose, release: 0.25, amp: [0.75, 0.5, 0.25].choose
      sleep 0.125
    end
  end
end

loop do
  sample :loop_amen, beat_stretch: 2
  sleep 2
end


##############################################
## Example 16 - a better way to thread
live_loop :beeps do
  start_note = ring(60, 62, 63, 62).tick
  my_chord = chord(start_note, :m7)
  play my_chord, release: 2
  16.times do
    play my_chord.choose, release: 0.25, amp: [0.75, 0.5, 0.25].choose
    sleep 0.125
  end
end

live_loop :drums do
  sample :loop_amen, beat_stretch: 2
  sleep 2
end


##############################################
## Example 17 - use a different synth
use_synth :saw
loop do
  play scale(60, :major).choose
  sleep 0.25
end


##############################################
## Example 18 - a simple pattern to demo effects
play 50
sleep 0.5
sample :elec_plip
sleep 0.5
play 62


##############################################
## Example 19 - adding reverb
with_fx :reverb do
  play 50
  sleep 0.5
  sample :elec_plip
  sleep 0.5
  play 62
end


##############################################
## Example 20 - adding echo
with_fx :echo do
  play 50
  sleep 0.5
  sample :elec_plip
  sleep 0.5
  play 62
end


##############################################
## Example 21 - adding reverb and echo together
with_fx :echo do
  with_fx :reverb do
    play 50
    sleep 0.5
    sample :elec_plip
    sleep 0.5
    play 62
  end
end
@joesh1
joesh1 commented on May 22, 2017
Thanks for your excellent ideas, I like the use of 'tick.even?' in your drum idea, I've been looking for a way of combining drum patterns in SP. It seems to be a little clumsy for developing more complex (and lengthy) ideas, especially if they need to be in sync. I've tried experimenting with 'spread ' which also produces some interesting ideas.

@xbash
xbash commented on Jan 5, 2020
live_loop :fun do
sample :bd_haus, amp: 5, release: 8, cutoff:110
sleep 0.5
end
sample :ambi_lunar_land, amp: 5, cutoff:110

live_loop :prophet do
use_synth :prophet
play 38, cutoff:110, attack: 6
sleep 0.25
play 50, cutoff:90, decay: 1
sleep 0.25
play 62, cutoff:60
sleep 0.25
end

@asgaraliyev
asgaraliyev commented on Jan 16, 2021
live_loop :drums do
  sample :loop_amen, beat_stretch: 2,amp:0.5
  sleep 2
  sample :elec_plip 
end
how about this one

@TuxedoCat619
TuxedoCat619 commented on Oct 29, 2021
use_bpm 33
live_loop :drums do
sample :elec_hi_snare, beat_stretch: 1, amp:0.4
sleep 1
sample :elec_hi_snare, beat_stretch: 2
sleep 1
end

@TuxedoCat619
TuxedoCat619 commented on Oct 29, 2021
use_bpm 9
live_loop :drums do
sample :loop_amen, beat_stretch: 2,amp:0.5
sleep 2
sample :ambi_drone
sample :ambi_glass_hum
sample :ambi_glass_rub
sample :ambi_drone
sample :ambi_haunted_hum
sample :ambi_drone
sample :ambi_lunar_land
end

@TuxedoCat619
TuxedoCat619 commented on Oct 29, 2021
use_bpm 44
live_loop :fun do
sample :bd_haus, amp: 5, release: 8, cutoff:110
sleep 0.5
end
sample :ambi_lunar_land, amp: 5, cutoff:110

live_loop :prophet do
use_synth :blade
play 38, cutoff:110, attack: 6
sleep 0.25
play 50, cutoff:90, decay: 1
sleep 0.25
play 62, cutoff:60
sleep 0.25
end

@TuxedoCat619
TuxedoCat619 commented on Oct 29, 2021
rand-seed-ver 33
Coded by Sam Aaron
Video: https://vimeo.com/110416910
use_debug false
load_samples [:bd_haus, :elec_blip, :ambi_lunar_land]

define :ocean do |num, amp_mul=1|
num.times do
s = synth [:bnoise, :cnoise, :gnoise].choose, amp: rrand(0.5, 1.5) * amp_mul, attack: rrand(0, 1), sustain: rrand(0, 2), release: rrand(0, 5) + 0.5, cutoff_slide: rrand(0, 5), cutoff: rrand(60, 100), pan: rrand(-1, 1), pan_slide: 1
control s, pan: rrand(-1, 1), cutoff: rrand(60, 110)
sleep rrand(0.5, 4)
end
end

define :echoes do |num, tonics, co=100, res=0.9, amp=1|
num.times do
play chord(tonics.choose, :minor).choose, res: res, cutoff: rrand(co - 20, co + 20), amp: 0.5 * amp, attack: 0, release: rrand(0.5, 1.5), pan: rrand(-0.7, 0.7)
sleep [0.25, 0.5, 0.5, 0.5, 1, 1].choose
end
end

define :bd do
cue :in_relentless_cycles
16.times do
sample :bd_haus, amp: 4, cutoff: 100
sleep 0.5
end
cue :winding_everywhichway
2.times do
2.times do
sample :bd_haus, amp: 4, cutoff: 100
sleep 0.25
end
sample :ambi_lunar_land
sleep 0.25
end
end

define :drums do |level, b_level=1, rand_cf=false|
synth :fm, note: :e2, release: 0.1, amp: b_level * 3, cutoff: 130
co = rand_cf ? rrand(110, 130) : 130
a = rand_cf ? rrand(0.3, 0.5) : 0.6
n = rand_cf ? :bnoise : :noise
synth :noise, release: 0.05, cutoff: co, res: 0.95, amp: a if level > 0
sample :elec_blip, amp: 2, rate: 2, pan: rrand(-0.8, 0.8) if level > 1
sleep 1
end

define :synths do |s_name, co, n=:e2|
use_synth s_name
use_transpose 0
use_synth_defaults detune: [12,24].choose, amp: 1, cutoff: co, pulse_width: 0.12, attack: rrand(0.2, 0.5), release: 0.5 , mod_phase: 0.25, mod_invert_wave: 1

play :e1, mod_range: [7, 12].choose, pan: rrand(-1, 1)
sleep 0.125

play :e3, mod_range: [7, 12].choose, pan: rrand(-1, 1)
sleep [0.25, 0.5].choose

play n, mod_range: 12, pan: rrand(-1, 1)
sleep 0.5

play chord(:e2, :minor).choose, mod_range: 12, pan: rrand(-1, 1)
sleep 0.25
end

define :play_synths do
with_fx :reverb do |r|
with_fx :echo, phase: 0.25 do |e|
synths = [:mod_pulse, :mod_saw, :mod_dsaw, :mod_dsaw, :mod_dsaw, :mod_dsaw]
cutoffs = [108, 78, 88, 98]
synth = synths.rotate!.first
4.times do |t|
puts shuffle("0" * (30 - t) + ("1" * t)) unless t == 0
co = cutoffs.rotate!.first + (t * 2)
7.times do
n = chord([:e2, :e3, :e4, :e5][t], :minor).choose
synths(synth, co, n)
end
sleep 2
end
sleep 1
cue :within
end
end
end

define :binary_celebration do |n=1, st=1|
in_thread do
n.times do
puts (0..30).map{|_| ["0", "1"].choose}.join
sleep st
end
end
end

puts 'Introduction'
puts 'The Curved Ebb of Carpentry'
sleep 2

cue :oceans
at [7, 12], [:crash, :within_oceans] do |m|
cue m
end

uncomment do
use_random_seed 1000
with_bpm 45 do
with_fx :reverb do
with_fx(:echo, delay: 0.5, decay: 4) do
in_thread do
use_random_seed 2
ocean 5
ocean 1, 0.5
ocean 1, 0.25
end
sleep 10
use_random_seed 1200
echoes(5, [:b1, :b2, :e1, :e2, :b3, :e3])
cue :a_distant_object
echoes(5, [:b1, :e1, :e2, :e3])
cue :breathes_time
in_thread do
echoes(5, [:e1, :e2, :e3])
end
use_synth :tb303
echoes(1, [:e1, :e2, :e3], 60, 0.9, 0.5)
echoes(1, [:e1, :e2, :e3], 62)
echoes(1, [:e1, :e2, :e3], 64, 0.97)
echoes(1, [:e1, :e2, :e3], 66)
echoes(1, [:e1, :e2, :e3], 68)
cue :liminality_holds_fast
echoes(4, [:b1, :e1, :e2, :b3, :e3], 80)
echoes(1, [:b1, :b2, :e1, :e2, :b3, :e3], 85, 0.98)
cue :within_reach
echoes(5, [:e1, :b2], 90)
cue :as_it_unfolds
in_thread do
echoes(5, [:e1], 90)
end
end
end
end
end

in_thread(name: :bassdrums) do
use_random_seed 0
sleep 22
3.times do
bd
end
sleep 28
live_loop :bd do
bd
end
end

in_thread(name: :drums) do
use_random_seed 0
level = -1
with_fx :echo do |e|
sleep 2
drums -1, 0.1
drums -1, 0.2
drums -1, 0.4
drums -1, 0.7
puts "Part 2"
puts "Inside the Machine"
3.times do
8.times do
drums level, 0.8
end
6.times do
drums(level)
end

  sleep 1
  level += 1
end
sleep 4
cue :dreams
8.times do
  drums 1, 1, true
end

10.times do
  m = choose [shuffle(:within_dreams), :within_dreams, :dreams_within]
  cue m
  drums 2, 1, true
end

6.times do
  m = choose [shuffle("within") + "_dreams", :within_dreams.shuffle, "dreams_" + shuffle("within")]
  cue m
  drums 2
end

live_loop :drums do
  8.times do |i|
    drums 1
  end
  
  16.times do |i|
    cue " " * rand_i(32)
    at 1 do
      cue "  " * i
    end
    drums 2
  end
end
end
end

in_thread name: :synths do
use_random_seed 0
sleep 12
cue :the_flow_of_logic
play_synths
end

in_thread do
use_random_seed 0
sync :within
puts "Part 3"
puts "Reality A"
sleep 12
use_synth_defaults phase: 0.5, res: 0.5, cutoff: 80, release: 3.3, wave: 1

2.times do
[80, 90, 100, 110].each do |cf|
use_merged_synth_defaults cutoff: cf
puts "1" * 30
synth :zawa, note: :e2, phase: 0.25
synth :zawa, note: :a1
sleep 3
end
4.times do |t|
binary_celebration(6, 0.5)
synth :zawa, note: :e2, phase: 0.25, res: rrand(0.8, 0.9), cutoff: [100, 105, 110, 115][t]
sleep 3
end
end

puts 'Part n'
puts 'The Observer becomes the Observed'

Your turn...
end

@TuxedoCat619
TuxedoCat619 commented on Oct 29, 2021
Coded by SonicPit
Taken from "Beats basteln wie die Großen"
c't 13/2017
Note: requires a powerful machine to run smoothly.
use_bpm 70

HISS
live_loop :hiss_loop do
sample :vinyl_hiss, amp: 2
sleep sample_duration :vinyl_hiss
end

HIHAT
define :hihat do
use_synth :pnoise
with_fx :hpf, cutoff: 120 do
play release: 0.01, amp: 13
end
end

live_loop :hihat_loop do
divisors = ring 2, 4, 2, 2, 2, 2, 2, 6
divisors.tick.times do
hihat
sleep 1.0 / divisors.look
end
end

SNARE
live_loop :snare_loop do
sleep ring(2.5, 3)[tick]
with_fx :lpf, cutoff: 100 do
sample :sn_dub, sustain: 0, release: 0.05, amp: 3
end
sleep ring(1.5, 1)[look]
end

BASSDRUM
define :bassdrum do |note1, duration, note2 = note1|
use_synth :sine
with_fx :hpf, cutoff: 100 do
play note1 + 24, amp: 40, release: 0.01
end
with_fx :distortion, distort: 0.1, mix: 0.3 do
with_fx :lpf, cutoff: 26 do
with_fx :hpf, cutoff: 55 do
bass = play note1, amp: 85, release: duration, note_slide: duration
control bass, note: note2
end
end
end
sleep duration
end

live_loop :bassdrum_schleife do
bassdrum 36, 1.5
if bools(0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0)[tick]
bassdrum 36, 0.5, 40
bassdrum 38, 1, 10
else
bassdrum 36, 1.5
end
bassdrum 36, 1.0, ring(10, 10, 10, 40)[look]
end

CHORD CONTROL
This part provides two rings called "chord_high" and "chord_low".
They always contain the "permitted" notes in order that everything will be in tune.
You can use them in other live loops to select notes.
chord_1 = chord :c4, :maj9, num_octaves: 2
chord_2 = chord :es4, :maj9, num_octaves: 2
chord_3 = chord :b3, :maj9, num_octaves: 2
chord_4 = chord :d4, :maj9, num_octaves: 2

chord_low_1 = chord :c2, :maj9
chord_low_2 = chord :es2, :maj9
chord_low_3 = chord :b1, :maj9
chord_low_4 = chord :d2, :maj9

chord_high = chord_1
chord_low = chord_low_1

live_loop :chord_selector, delay: -0.5 do
chord_high = (knit(chord_1, 2, chord_2, 2, chord_3, 4,chord_4, 4)).tick
chord_low = (knit(chord_low_1, 2, chord_low_2, 2, chord_low_3, 4, chord_low_4, 4)).look
sleep 8
end

SPHERES
define :chord_player do |the_chord|
use_synth :blade
the_chord.each do |note|
play note, attack: rand(4), release: rand(6..8), cutoff: rand(50..85), vibrato_rate: rand(0.01..2), amp: 0.55
end
end

with_fx :reverb, room: 0.99, mix: 0.7 do
live_loop :chord_loop do
chord_player chord_high.pick(6)
chord_player chord_low.take(3)
sleep 8
end
end

Coded by Pit Noack
supported by
Alexander Degraf
Astrid Hagenguth
Enrico Mercaldi
http://www.maschinennah.de/
mail@pitnoack.de
@williavs
Comment
 
Leave a comment
 
Footer
© 2025 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact
Manage cookies
Do not share my personal information
