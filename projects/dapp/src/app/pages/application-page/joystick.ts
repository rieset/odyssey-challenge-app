import {ApplicationService} from '@services/application/application.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';


type Coords = { x: number , y: number }
class Joystick {
  private destroyed$ = new Subject();
  dragStart: Coords | null;
  currentPos: Coords;
  maxDiff: number;
  stick: HTMLElement;
  stickInner: HTMLElement;
  stickDirection: HTMLElement;
  public readonly direction$ = this.applicationService.direction$.pipe(takeUntil(this.destroyed$))
  constructor (
    parent: HTMLElement,
    private applicationService: ApplicationService,
  ) {
    this.dragStart = null;
    this.currentPos = { x: 0, y: 0 };
    this.maxDiff = 80;
    this.stick = document.createElement('div');
    this.stickInner = document.createElement('span');
    this.stickInner.classList.add('joystick-stick-inner');
    this.stickDirection = document.createElement('span');
    this.stickDirection.classList.add('joystick-stick-direction');
    this.stick.classList.add('joystick-stick');
    parent.appendChild( this.stick );
    this.stick.appendChild( this.stickDirection );
    this.stick.appendChild( this.stickInner );

    this.stick.addEventListener( 'mousedown', this.handleMouseDown.bind( this ) );
    document.addEventListener('mousemove', this.handleMouseMove.bind( this ) );
    document.addEventListener('mouseup', this.handleMouseUp.bind( this ) );
    this.stick.addEventListener('touchstart', this.handleMouseDown.bind( this) );
    document.addEventListener('touchmove', this.handleMouseMove.bind( this ) );
    document.addEventListener('touchend', this.handleMouseUp.bind( this ) );

    this.direction$.subscribe((val: Coords) => {
      this.stickDirection.style.transform = `rotate(${this.getAngle(val)}deg)`;
    })

  }
  handleMouseDown ( event: MouseEvent|TouchEvent ) {
    this.stick.style.transition = '0s';
    if ( event instanceof TouchEvent){
      if (event.changedTouches) {
        this.dragStart = {
          x: event.changedTouches[0].clientX,
          y: event.changedTouches[0].clientY,
        };
        return;
      }
    }
    if ( event instanceof  MouseEvent){
      this.dragStart = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  };
  handleMouseMove ( event: MouseEvent|TouchEvent ) {
    if ( this.dragStart === null ) { return; }
    event.preventDefault();
    let eventX = 0;
    let eventY = 0;
    if ( event instanceof TouchEvent){
      if (event.changedTouches) {
        eventX = event.changedTouches[0].clientX;
        eventY = event.changedTouches[0].clientY;
      }
    }
    if ( event instanceof MouseEvent){
      eventX = event.clientX;
      eventY = event.clientY;
    }

    const xDiff = eventX - this.dragStart.x;
    const yDiff = eventY - this.dragStart.y;
    const angle = Math.atan2( yDiff, xDiff );
    const distance = Math.min( this.maxDiff, Math.hypot( xDiff, yDiff ) );

    // Get the distance between the cursor and the center
    const distanceOld = Math.sqrt( Math.pow( xDiff, 2 ) + Math.pow( yDiff, 2 ) );

    const xNew = distance * Math.cos( angle );
    const yNew = distance * Math.sin( angle );
    this.stick.style.transform = `translate3d(${xNew}px, ${yNew}px, 0px)`;
    this.currentPos = { x: xNew, y: yNew };

    this.applicationService.direction$.next({
      x: this.normalize(this.currentPos.x),
      y: this.normalize(-this.currentPos.y)
    })
    this.updateServiceSpeed();
  };

  updateServiceSpeed (){
    this.applicationService.speed$.next( Math.sqrt(
      this.normalize(this.currentPos.x) *
      this.normalize(this.currentPos.x) +
      this.normalize(this.currentPos.y) *
      this.normalize(this.currentPos.y)
    ) * 15 )
    //console.log('speed', this.applicationService.speed$.getValue());
  }

  getAngle (coords: Coords){
    let angle = Math.atan2(-coords.y - 0, coords.x - 0) * 180 / Math.PI;
    if (angle < 0) {
      angle += 360;
    }
    return angle;
  }

  normalize (value: number, min: number = 0, max: number = this.maxDiff) {
    return (value - min) / (max - min);
  }

  handleMouseUp (event: MouseEvent|TouchEvent) {
    if ( this.dragStart === null ) { return; }
    this.stick.style.transition = '.2s';
    this.stick.style.transform = `translate3d(0px, 0px, 0px)`;
    this.dragStart = null;
    this.currentPos = { x: 0, y: 0 };
    this.applicationService.direction$.next({
      x: this.normalize(this.currentPos.x, 0, 80),
      y: this.normalize(-this.currentPos.y, 0, 80)
    })
    this.updateServiceSpeed();
  };

  destroy (){
    this.destroyed$.next();

    this.stick.removeEventListener( 'mousedown', this.handleMouseDown.bind( this ) );
    document.removeEventListener('mousemove', this.handleMouseMove.bind( this ) );
    document.removeEventListener('mouseup', this.handleMouseUp.bind( this ) );
    this.stick.removeEventListener('touchstart', this.handleMouseDown.bind( this) );
    document.removeEventListener('touchmove', this.handleMouseMove.bind( this ) );
    document.removeEventListener('touchend', this.handleMouseUp.bind( this ) );
  }
}

export { Joystick as default };
