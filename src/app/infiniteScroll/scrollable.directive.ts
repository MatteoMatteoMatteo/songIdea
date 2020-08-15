import { Directive, Output, EventEmitter, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[appScrollable]",
})
export class ScrollableDirective {
  @Output() scrollPosition = new EventEmitter();

  constructor(public el: ElementRef) {}

  @HostListener("document:scroll", ["$event"])
  onScroll(event) {
    console.log("im scrooooliiings");
    try {
      console.log("im scrooooliiings");
      const top = event.target.scrollTop;
      const height = this.el.nativeElement.scrollHeight;
      const offset = this.el.nativeElement.offsetHeight;

      if (top > height - offset - 1) {
        this.scrollPosition.emit("bottom");
        console.log("lol");
      }

      if (top === 0) {
        this.scrollPosition.emit("top");
        console.log("hey");
      }
    } catch (err) {}
  }
}
