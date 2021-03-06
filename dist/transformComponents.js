'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformComponentsInNode = transformComponentsInNode;
exports.default = transformComponents;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _traverse = require('./traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _wrapRender = require('./wrapRender');

var _wrapRender2 = _interopRequireDefault(_wrapRender);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformComponentsInNode(node, transformComponent) {
  return (0, _traverse2.default)(node, {
    ComponentElement: function ComponentElement(path) {
      var _path$node = path.node,
          type = _path$node.type,
          props = _path$node.props;

      return _react2.default.createElement(transformComponent(type), props);
    }
  });
}

var transformComponentsMemo = new WeakMap();
function transformComponents(transformComponent) {
  if (!transformComponentsMemo.has(transformComponent)) {
    transformComponentsMemo.set(transformComponent, new WeakMap());
  }
  var transformComponentMemo = transformComponentsMemo.get(transformComponent);
  return function (type) {
    if (typeof type === 'string') {
      return type;
    }
    if (!transformComponentMemo.has(type)) {
      if (_react2.default.isValidElement(type)) {
        transformComponentMemo.set(type, _react2.default.createElement(transformComponents(transformComponent)(function () {
          return type;
        })));
      } else {
        transformComponentMemo.set(type, transformComponent((0, _wrapRender2.default)(function (node) {
          return transformComponentsInNode(node, function (childType) {
            return transformComponents(transformComponent)(childType);
          });
        })(type)));
      }
    }
    return transformComponentMemo.get(type);
  };
}