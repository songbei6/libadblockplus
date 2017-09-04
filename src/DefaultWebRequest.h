/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-present eyeo GmbH
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

#ifndef ADBLOCK_PLUS_DEFAULT_WEB_REQUEST_H
#define ADBLOCK_PLUS_DEFAULT_WEB_REQUEST_H

#include <AdblockPlus/IWebRequest.h>
#include <AdblockPlus/Scheduler.h>

namespace AdblockPlus
{
  /**
   * `WebRequest` implementation that uses `WinInet` on Windows and libcurl
   * on other platforms. A dummy implementation that always reports failure is
   * used if libcurl is not available.
   */
  class DefaultWebRequestSync : public IWebRequestSync
  {
  public:
    ServerResponse GET(const std::string& url, const HeaderList& requestHeaders) const override;
  };

  class DefaultWebRequest : public IWebRequest
  {
  public:
    explicit DefaultWebRequest(const Scheduler& scheduler, WebRequestSyncPtr syncImpl);
    ~DefaultWebRequest();

    void GET(const std::string& url, const HeaderList& requestHeaders, const GetCallback& getCallback) override;
  private:
    Scheduler scheduler;
    WebRequestSyncPtr syncImpl;
  };
}

#endif
