from oci import config
import cx_Oracle
from oci import database
from oci import identity
from oci import retry
from oci import resource_search
from oci import wait_until
from datetime import datetime
import json
import os
import sys
import time

try:
    
    lib_dir = os.path.join(os.environ.get("HOME"), "Downloads",
                            "instantclient_19_8")
    cx_Oracle.init_oracle_client(lib_dir=lib_dir, config_dir="/Users/mgubar/Code/moviestream-demo/setup/wallet_frompy")

    con2 = cx_Oracle.connect("admin", "TomHanksBig123#", "frompy_low")

    print("success")

except Exception as err:
    print("Whoops!")
    print(err);
    sys.exit(1);