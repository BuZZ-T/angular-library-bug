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
* The `createContent()` function of `content.utils.ts` was used in the TestLibComponent, so that it's included in the build

## Build steps to reproduce bug

* install dependencies: `npm install`
* build library: `npm run build:lib` (=`ng build test-lib`)

## Bug description

### Source code where the bug takes place during the build steps

#### test-app/projects/test-lib/src/lib/utils/content.utils.ts
```ts
import { getData } from './get.utils'

export const createContent = () => getData()
```
Be aware that the return type of `getData() ` is not specified and will be added to the declaration file in the build

#### test-app/projects/test-lib/src/lib/utils/get.utils.ts
```ts
import { IData } from './IData'

export const getData = (): IData => ({
  name: 'foo',
  value: 3
})
```

#### test-app/projects/test-lib/src/lib/utils/IData.ts
```ts
export interface IData {
  name: string
  value: number
}
```

### created declaration files on build
When running `ng build test-lib`, the following file is created (among others):

#### test-app/dist/test-lib/lib/utils/content.utils.d.ts
```ts
export declare const createContent: () => import("projects/test-lib/src/lib/utils/IData").IData;
```

As you can see, the path is relative to the `baseUrl` specified in the `tsconfig.app.json`

```json
"baseUrl": "./",
```

by adding a `baseUrl` to the `tsconfig.lib.json` of the angular library, this path can be changed

## Expected behaviour

In my opinion, the correct path for the transitive import of `IData` would be:

```ts
export declare const createContent: () => import("./IData").IData;
```

so the path is valid after build, because it is relative to the file containing the declaration, not relative to the `baseUrl` and the folder structure of the **source folder**.

## Further investigation

On compiling with `tsc`, the same behaviour is observed:

```bash
cd test-app/projects/test-lib
cp tsconfig.lib.json tsconfig.json
../../../node_modules/.bin/tsc
```
### test-app/out-tsc/lib/lib/utils/content.utils.d.ts

```ts
export declare const createContent: () => import("projects/test-lib/src/lib/utils/IData").IData;
```
