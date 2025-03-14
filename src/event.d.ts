import { DragCancelEvent } from './event.d';
import { Active, Over } from '../store';
import type { Collision } from '@dnd-kit/core';
import type { Translate } from '@dnd-kit/utilities';
interface DragEvent{
	activatorEvent: Event;
	active: Active;
	collisions: Collision[] | null;
	delta: Translate;
	over: Over | null;
}
export interface DragStartEvent extends Pick < DragEvent, 'active' > {
	
} 
export interface DragMoveEvent extends DragEvent {

}
export interface DragOverEvent extends DragMoveEvent {

}
export interface DragEndEvent extends DragEvent{

}
export interface DragCancelEvent extends DragEndEvent{

}
export { DragStartEvent, DragStartEvent, DragOverEvent, DragEndEvent, DragCancelEvent };