# Angular application containing bug

## How this project was created

```bash
git init test-project.git
cd test-project.git/
npm install @angular/cli
npx ng g new test-app
cd test-app/
npx ng g component test1 # just for testing
npx ng generate library test-lib
```

Besides of that, only these things were done:

* The TestLibModule was added to the AppModule
* The Test1Component and the TestLibComponent where added to the app.component.html

## Build steps to reproduce bug

* install dependencies: `npm install`
* build library: `npm run build:lib` (=`ng build test-lib`)

## Bug description

* A function `getData()` is imported and used
* The return value of this function is stored in a variable
* The return type `IData` of this function is not explicitely declared for the variable but inferred
* The return type of this function is non-primitive and is also defined in this project
* On compiling, the return type `IData` is added by typescript inline by pointing to the file where the interface is declared
* The path to this file is relative to the baseUrl and points to the source file, which is not available after the build

### Source code where the bug takes place during the build steps

#### test-app/projects/test-lib/src/lib/utils/data.utils.ts ([link](test-app/projects/test-lib/src/lib/utils/data.utils.ts))
```ts
import { getData } from './get.utils'

export const data = getData()
```
Be aware that the return type of `getData() ` is not specified and will be added to the declaration file in the build

#### test-app/projects/test-lib/src/lib/utils/get.utils.ts ([link](test-app/projects/test-lib/src/lib/utils/get.utils.ts))
```ts
export interface IData {
  name: string
  value: number
}

export const getData = (): IData => ({
  name: 'foo',
  value: 3
})
```

#### test-app/projects/test-lib/src/lib/test-lib.component.ts (snippet) ([link](test-app/projects/test-lib/src/lib/test-lib.component.ts))
```ts
import { data } from './utils/data.utils'

  ...

  public text: string
  
  ...

  constructor() {
    this.text = `my data: ${data.name} / ${data.value}`
  }
```

### created declaration files on build
When running `ng build test-lib`, the following file is created (among others):

#### test-app/dist/test-lib/lib/utils/data.utils.d.ts
```ts
export declare const data: import("projects/test-lib/src/lib/utils/get.utils").IData;
```

As you can see, the path is relative to the `baseUrl` specified in the `tsconfig.app.json`

```json
"baseUrl": "./",
```

by adding a `baseUrl` to the `tsconfig.lib.json` of the angular library, this path can be changed

## Expected behaviour

In my opinion, the correct path for the transitive import of `IData` would be:

```ts
export declare const data: import("./get.utils").IData;
```

so the path is valid after build, because it is relative to the file containing the declaration, not relative to the `baseUrl` and the folder structure of the **source folder**.

## Further investigation

On compiling with `tsc`, the same behaviour is observed:

```bash
cd test-app/projects/test-lib
cp tsconfig.lib.json tsconfig.json
../../../node_modules/.bin/tsc
```
### test-app/out-tsc/lib/lib/utils/data.utils.d.ts

```ts
export declare const data: import("projects/test-lib/src/lib/utils/get.utils").IData;
```

## Workaround (which is not really applicable in larger projects)

Explicitly declare the type of the variable

### test-app/out-tsc/lib/lib/utils/workaround.utils.ts

```ts
import { getData, IData } from './get.utils'

export const dataWorkaround:IData = getData()
```

which compiles to:
```ts
import { IData } from './get.utils';
export declare const dataWorkaround: IData;
```
As `IData` is already known as explicitly imported, no inline import function has to be applied.
**But**: This is not a applicable for the following reasons:

* The "wrong" code is valid TypeScript and it's really unintuitive that it shouldn't be allowed
* No tooling support (e.g. linting in IDE or via script)
* Not even building the library reveals the error
* Only when trying to use *every* place where the explicit import was forgotten, the error is noticed