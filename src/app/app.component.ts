import { Component, OnInit } from '@angular/core';
import {
  faArrowLeft,
  faBars,
  faPause,
  faPlay,
  faBackward,
  faForward,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  faArrowLeft = faArrowLeft;
  faBars = faBars;
  faPause = faPause;
  faPlay = faPlay;
  faBackward = faBackward;
  faForward = faForward;

  title = 'reproductor-music';

  now_playing: string = '';
  track_art: string = '';
  track_name: string = '';
  track_artist: string = '';

  playpause_btn: any = '';
  next_btn: any = '';
  prev_btn: any = '';

  seek_slider: any = '';
  volume_slider: any = '';
  curr_time: any = 0;
  total_duration: string = '';

  track_index: number = 0;
  isPlaying: boolean = false;
  updateTimer: any;

  // Create new audio element
  curr_track: any = document.createElement('audio');

  // Define the tracks that have to be played
  track_list = [
    {
      name: 'Night Owl',
      artist: 'Broke For Free',
      image:
        'https://images.pexels.com/photos/2264753/pexels-photo-2264753.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250',
      path: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3',
    },
    {
      name: 'Enthusiast',
      artist: 'Tours',
      image:
        'https://images.pexels.com/photos/3100835/pexels-photo-3100835.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250',
      path: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3',
    },
    {
      name: 'Shipping Lanes',
      artist: 'Chad Crouch',
      image:
        'https://images.pexels.com/photos/1717969/pexels-photo-1717969.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250',
      path: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3',
    },
  ];

  resetValues() {
    this.curr_time = 0;
    this.total_duration = '00:00';
    this.seek_slider = 0;
  }

  loadTrack(track_index: number) {
    clearInterval(this.updateTimer);
    this.resetValues();
    this.curr_track.src = this.track_list[track_index].path;
    this.curr_track.load();

    this.track_name = this.track_list[track_index].name;
    this.track_artist = this.track_list[track_index].artist;
    this.now_playing =
      'PLAYING ' + (track_index + 1) + ' OF ' + this.track_list.length;
    this.curr_track.addEventListener('ended', ()=>{
      if (this.track_index < this.track_list.length - 1) this.track_index += 1;
      else this.track_index = 0;
      this.loadTrack(this.track_index);
      this.playTrack();
    });
  }

  ngOnInit(): void {
    // Load the first track in the tracklist
    this.loadTrack(this.track_index);

    setInterval(() => {
      let seekPosition = 0;

      if (!isNaN(this.curr_track.duration)) {
        seekPosition = this.curr_track.currentTime * (100 / this.curr_track.duration);

        this.seek_slider = seekPosition;

        let currentMinutes = Math.floor(this.curr_track.currentTime / 60);
        let currentSeconds = Math.floor(
          this.curr_track.currentTime - currentMinutes * 60
        );
        let durationMinutes = Math.floor(this.curr_track.duration / 60);
        let durationSeconds = Math.floor(
          this.curr_track.duration - durationMinutes * 60
        );

        if (currentSeconds < 10) {
          currentSeconds = 0 + currentSeconds;
        }
        if (durationSeconds < 10) {
          durationSeconds = 0 + durationSeconds;
        }
        if (currentMinutes < 10) {
          currentMinutes = 0 + currentMinutes;
        }
        if (durationMinutes < 10) {
          durationMinutes = 0 + durationMinutes;
        }

        this.curr_time = currentMinutes + ':' + currentSeconds;
        this.total_duration = durationMinutes + ':' + durationSeconds;
      }
    }, 1000);
  }

  playpauseTrack() {
    if (!this.isPlaying) this.playTrack();
    else this.pauseTrack();
  }

  playTrack() {
    this.curr_track.play();
    this.isPlaying = true;
  }

  pauseTrack() {
    this.curr_track.pause();
    this.isPlaying = false;
  }

  nextTrack() {
    if (this.track_index < this.track_list.length - 1) this.track_index += 1;
    else this.track_index = 0;
    this.loadTrack(this.track_index);
    this.playTrack();
  }

  prevTrack() {
    if (this.track_index > 0) {
      this.track_index -= 1;
      this.loadTrack(this.track_index);
      this.playTrack();
    } else {
      this.track_index = this.track_list.length - 1;
      this.loadTrack(this.track_index);
      this.playTrack();
    }
  }

  seekTo() {
    let seekto = this.curr_track.duration * (this.seek_slider.value / 100);
    this.curr_track.currentTime = seekto;
  }

  setVolume() {
    this.curr_track.volume = this.volume_slider.value / 100;
  }
}
