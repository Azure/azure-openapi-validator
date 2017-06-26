// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Perks.JsonRPC;

namespace AutoRest
{

  public class AutoRestAsAsService
  {
    private Connection connection;

    public async Task<int> Run()
    {
      connection = new Connection(Console.Out, Console.OpenStandardInput());
      // connection.OnDebug += (t) => Console.Error.WriteLine(t);

      connection.Dispatch<IEnumerable<string>>(nameof(GetPluginNames), GetPluginNames);
      connection.Dispatch<string, string, bool>(nameof(Process), Process);
      connection.DispatchNotification("Shutdown", connection.Stop);

      // wait for somethign to do.
      await connection;

      Console.Error.WriteLine("Shutting Down");
      return 0;
    }

    public async Task<IEnumerable<string>> GetPluginNames()
    {
      return new[] { "azure-validator"};
    }

    public async Task<bool> Process(string plugin, string sessionId)
    {
      if(plugin=="azure-validator")
      { 
          return await new AzureValidator(connection, sessionId).Process();
      }
      return false;
    }
  }

}