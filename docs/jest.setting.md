## Jest setting

### Jest install  
```- yarn add --dev jest ``` 

### Setting for typescript  
```- yarn add --dev @types/jest ```  
package.json
```JSON
"jest": 
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js"
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "globals": {
      "ts-jest": {
        "tsConfig": "tsconfig.json"
      }
    },
    "testMatch": [
      "**/__tests__/*.+(ts|tsx|js)"
    ]
  }
```
### Setting for react 
```yarn add --dev react-test-renderer```  
```yarn add --dev jest babel-jest babel-preset-env babel-preset-react react-test-renderer```

### settring for react native
```yarn add --dev metro-react-native-babel-preset```
package.json
```JSON
 "jest": {
    "preset": "react-native",
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js"
    ],
    "transform": {
      "^.+\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js",
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "globals": {
      "ts-jest": {
        "tsConfig": "tsconfig.json"
      }
    },
    "testMatch": [
      "**/__tests__/*.+(ts|tsx|js)"
    ]
  } 
```
### but... Jest can only snapshot... to test react native

### can test component by using enzyme and JSDOM
```yarn add --dev enzyme @types/enzyme```  
```yarn add --dev enzyme-adapter-react-16 @types/enzyme-adapter-react-16```  
```yarn add --dev jest-enzyme```  
```yarn add --dev react-dom```  
```yarn add --dev react-test-renderer @types/react-test-renderer ```  
```yarn add --dev react-native-typescript-transformer```  

# refernce 
https://github.com/ProminentEdge/mobile-boilerplate
https://github.com/airbnb/enzyme/blob/master/docs/guides/react-native.md
