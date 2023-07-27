import { Component,Injectable } from '@angular/core';
import { Task } from './task/task';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent, TaskDialogResult } from './task-dialog/task-dialog.component';
import { Firestore ,addDoc,collection,collectionData ,deleteDoc,doc, updateDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { runTransaction } from "firebase/firestore";
@Injectable({
  providedIn:'root'
})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kanban-fire';

  constructor(private dialog: MatDialog, private store: Firestore) {}

  // todo: Task[] = [
  //   {
  //     title: 'Buy milk',
  //     description: 'Go to the store and buy milk'
  //   },
  //   {
  //     title: 'Create a Kanban app',
  //     description: 'Using Firebase and Angular create a Kanban app!'
  //   }
  // ];
  // inProgress: Task[] = [];
  // done: Task[] = [];
  //todo = this.store.collection('todo').valueChanges({ idField: 'id' }) as Observable<Task[]>;
  todo = collectionData(collection(this.store ,'todo') ,{ idField: 'id' }) as Observable<Task[]>;
  inProgress = collectionData(collection(this.store,'inProgress') ,{ idField: 'id' }) as Observable<Task[]>;
  done =collectionData(collection(this.store,'done') ,{ idField: 'id' }) as Observable<Task[]>;

  // export class AppComponent {
  //   item$: Observable<Item[]>;
  //   firestore: Firestore = inject(Firestore);
  
  //   constructor() {
  //     const itemCollection = collection(this.firestore, 'items');
  //     this.item$ = collectionData(collection);
  //   }
  // }

  // editTask(list: string, task: Task): void {}

 editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true,
      },
    });
    // dialogRef.afterClosed().subscribe((result: TaskDialogResult|undefined) => {
    //   if (!result) {
    //     return;
    //   }
    //   const dataList = this[list];
    //   const taskIndex = dataList.indexOf(task);
    //   if (result.delete) {
    //     dataList.splice(taskIndex, 1);
    //   } else {
    //     dataList[taskIndex] = task;
    //   }
    // });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult|undefined) => {
      if (!result) {
        return;
      }
      if (result.delete) {
        let docRef=doc(this.store,'task.id');
        deleteDoc(docRef);
       

       // collection(this.store, list).doc(task.id).delete();
      } else {
        let docRef=doc(this.store,'task.id');
        updateDoc ;
        //collection(this.store,list).doc(task.id).update(task);
      }
    });
  }


  // drop(event: CdkDragDrop<Task[]>): void {
  //   if (event.previousContainer === event.container) {
  //     return;
  //   }
  //   if (!event.container.data || !event.previousContainer.data) {
  //     return;
  //   }
  //   transferArrayItem(
  //     event.previousContainer.data,
  //     event.container.data,
  //     event.previousIndex,
  //     event.currentIndex
  //   );
  // }
  drop(event: any): void {
    if (event) {
      if (event.previousContainer === event.container) {
        return;
      }
      const item = event.previousContainer.data[event.previousIndex];
      const docRef=doc(this.store, event.previousContainer.id);
      const docReff=collectionData(collection(this.store ,event.previousContainer.id) ,{ idField: item.id });
      // this.store.firestore.runTransaction(() => {
      //   const promise = Promise.all([
      //     // addDoc(collection(this.store,'todo') , result.task);
      //     // collection(this.store,event.previousContainer.id).doc(item.id).delete(),
      //     // collection(this.store,event.previousContainer.id).doc(item.id).delete(),
      //     deleteDoc(docRef),
      //     addDoc(collection(this.store,event.container.id),item)
      //  //  collection( this.store,event.container.id).add(item),
      //   ]);
      //   return promise;
      // });
        
        runTransaction( this.store,  () => {
          const promise = Promise.all([
            // addDoc(collection(this.store,'todo') , result.task);
            // collection(this.store,event.previousContainer.id).doc(item.id).delete(),
            // collection(this.store,event.previousContainer.id).doc(item.id).delete(),
            deleteDoc(docRef),
            addDoc(collection(this.store,event.container.id),item)
        //  collection( this.store,event.container.id).add(item),
          ]);
          console.log("Transaction successfully committed!");
          return promise;
        });
    
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      // this.store.firestore.runTransaction(() => {
      //   const promise = Promise.all([
      //     // addDoc(collection(this.store,'todo') , result.task);
      //     // collection(this.store,event.previousContainer.id).doc(item.id).delete(),
      //     // collection(this.store,event.previousContainer.id).doc(item.id).delete(),
      //     deleteDoc(docRef),
      //     addDoc(collection(this.store,event.container.id),item)
      //  //  collection( this.store,event.container.id).add(item),
      //   ]);
      //   return promise;
      // });
    }
  }

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult|undefined) => {
        if (!result) {
          return;
        }
        // this.todo.push(result.task);
        //collection(this.store,'todo').add(result.task)
        // const docRef = await addDoc(collection(db, "cities"), {
        //   name: "Tokyo",
        //   country: "Japan"
        // });
        // console.log("Document written with ID: ", docRef.id);
        addDoc(collection(this.store,'todo') , result.task);
      });
  }


}
