/*
 * This file is part of the Adblock Plus extension,
 * Copyright (C) 2006-2012 Eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */

var API = (function()
{
  var Filter = require("filterClasses").Filter;
  var Subscription = require("subscriptionClasses").Subscription;
  var SpecialSubscription = require("subscriptionClasses").SpecialSubscription;
  var FilterStorage = require("filterStorage").FilterStorage;
  var defaultMatcher = require("matcher").defaultMatcher;
  var ElemHide = require("elemHide").ElemHide;
  var Synchronizer = require("synchronizer").Synchronizer;

  return {
    getFilterFromText: function(text)
    {
      text = Filter.normalize(text);
      if (!text)
        throw "Attempted to create a filter from empty text";
      return Filter.fromText(text);
    },

    isListedFilter: function(filter)
    {
      return filter.subscriptions.some(function(s)
      {
        return (s instanceof SpecialSubscription && !s.disabled);
      });
    },

    addFilterToList: function(filter)
    {
      FilterStorage.addFilter(filter);
    },

    removeFilterFromList: function(filter)
    {
      FilterStorage.removeFilter(filter);
    },

    getListedFilters: function()
    {
      var filters = {};
      for (var i = 0; i < FilterStorage.subscriptions.length; i++)
      {
        var subscription = FilterStorage.subscriptions[i];
        if (subscription instanceof SpecialSubscription)
        {
          for (var j = 0; j < subscription.filters.length; j++)
          {
            var filter = subscription.filters[j];
            if (!(filter.text in filters))
              filters[filter.text] = filter;
          }
        }
      }
      return Object.keys(filters).map(function(k)
      {
        return filters[k];
      });
    },

    getSubscriptionFromUrl: function(url)
    {
      return Subscription.fromURL(url);
    },

    isListedSubscription: function(subscription)
    {
      return subscription.url in FilterStorage.knownSubscriptions;
    },

    addSubscriptionToList: function(subscription)
    {
      FilterStorage.addSubscription(subscription);

      if (!subscription.lastDownload)
        Synchronizer.execute(subscription);
    },

    removeSubscriptionFromList: function(subscription)
    {
      FilterStorage.removeSubscription(subscription);
    },

    updateSubscription: function(subscription)
    {
      Synchronizer.execute(subscription);
    },

    isSubscriptionUpdating: function(subscription)
    {
      return Synchronizer.isExecuting(subscription.url);
    },

    getListedSubscriptions: function()
    {
      return FilterStorage.subscriptions.filter(function(s)
      {
        return !(s instanceof SpecialSubscription)
      });
    },

    checkFilterMatch: function(url, contentType, documentUrl)
    {
      // TODO: set thirdParty properly
      var thirdParty = false;
      return defaultMatcher.matchesAny(url, contentType, documentUrl, thirdParty);
    },

    getElementHidingSelectors: function(domain)
    {
      return ElemHide.getSelectorsForDomain(domain, false);
    }
  };
})();