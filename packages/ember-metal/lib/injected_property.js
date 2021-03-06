import Ember from "ember-metal/core"; // Ember.assert
import { ComputedProperty } from "ember-metal/computed";
import { Descriptor } from "ember-metal/properties";
import { create } from "ember-metal/platform";
import {
  meta,
  inspect
} from "ember-metal/utils";
import EmberError from "ember-metal/error";

/**
  Read-only property that returns the result of a container lookup.

  @class InjectedProperty
  @namespace Ember
  @extends Ember.Descriptor
  @constructor
  @param {String} type The container type the property will lookup
  @param {String} name (optional) The name the property will lookup, defaults
         to the property's name
*/
function InjectedProperty(type, name) {
  this.type = type;
  this.name = name;

  this._super$Constructor(injectedPropertyGet);
  this.readOnly();
}

function injectedPropertyGet(keyName) {
  var desc = meta(this).descs[keyName];

  Ember.assert("Attempting to lookup an injected property on an object " +
               "without a container, ensure that the object was " +
               "instantiated via a container.", this.container);

  return this.container.lookup(desc.type + ':' + (desc.name || keyName));
}

function injectedPropertySet(obj, keyName) {
  throw new EmberError("Cannot set injected property '" + keyName + "' on object: " + inspect(obj));
}

InjectedProperty.prototype = create(Descriptor.prototype);

var InjectedPropertyPrototype = InjectedProperty.prototype;
var ComputedPropertyPrototype = ComputedProperty.prototype;

InjectedPropertyPrototype._super$Constructor = ComputedProperty;

InjectedPropertyPrototype.get = ComputedPropertyPrototype.get;
InjectedPropertyPrototype.readOnly = ComputedPropertyPrototype.readOnly;

InjectedPropertyPrototype.set = injectedPropertySet;

InjectedPropertyPrototype.teardown = ComputedPropertyPrototype.teardown;

export default InjectedProperty;
